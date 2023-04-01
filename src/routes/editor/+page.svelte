<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { type Article, ArticleSize, getRandomInitialSuggestions } from '$lib/articles';
	import ArticleContent from '$lib/components/ArticleContent.svelte';
	import ArticlePlaceholder from '$lib/components/ArticlePlaceholder.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Human from '$lib/components/icons/Human.svelte';
	import Loading from '$lib/components/icons/Loading.svelte';
	import Robot from '$lib/components/icons/Robot.svelte';
	import SubmitPrompt from '$lib/components/icons/SubmitPrompt.svelte';
	import { type Message, MessageRole } from '$lib/messages';
	import { Sentiment } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import { slide } from 'svelte/transition';

	import ToastSuccess from './ToastSuccess.svelte';

	let messages: Message[] = [];
	let article: Article | null = null;
	let suggestions: string[] = getRandomInitialSuggestions();
	let error: string | null = null;
	let fieldError: string[] | null = null;
	let textareaRef: HTMLTextAreaElement;
	let scrollToLi: HTMLLIElement;

	$: prompt = '';
	$: isLoading = false;

	function setSuggestion(suggestion: string) {
		prompt = suggestion;
		textareaRef.focus();
	}

	function scrollToBottom() {
		setTimeout(() => {
			scrollToLi.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}

	function submitGenerate() {
		toast.dismiss();
		isLoading = true;
		article = null;
		error = null;
		fieldError = null;

		//
		//
		//
		messages = [...messages, { role: MessageRole.USER, content: prompt }];
		scrollToBottom();
		//
		//
		//

		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				article = result.data?.article || null;
				messages = result.data?.messages || null;
				suggestions = result.data?.suggestions || [];
			}
			if (result.type === 'failure') {
				error = result.data?.error || null;
				fieldError = result.data?.fieldError || null;
				await applyAction(result);
			}

			update();
			scrollToBottom();
			isLoading = false;
			prompt = '';
		};
	}

	function submitPublish() {
		isLoading = true;
	}

	// $: if (isLoading) toast.loading('Generating article...', { id: 'loading' });
	// $: if (article) toast.success(ToastSuccess, { id: 'loading', userId: article?.user?.id } as any);
	// $: if (error) toast.error(error, { id: 'loading' });
</script>

<div class="chat">
	<ul class="chat__messages">
		{#if messages}
			{#each messages as message}
				{@const { role, content } = message}
				{@const roleClass = role?.toLowerCase()}
				{@const isLastMessage = messages.indexOf(message) === messages.length - 1}

				{#if isLastMessage}
					<li bind:this={scrollToLi} />
				{/if}

				<li class="chat__container"  transition:slide={{ duration: 150 }}>
					<div class={`chat__message chat__message--${roleClass}`}>
						{#if role === MessageRole.USER}
							<Human />
							<p class={`chat__content chat__content--${roleClass}`}>
								{content}
							</p>
						{:else if role === MessageRole.ASSISTANT}
							<Robot />
							<div class="chat__assistant-response">
								<p class={`chat__content chat__content--${roleClass}`}>
									{content.notes}
								</p>

								<article class="chat__article">
									<h2 class="chat__article-h2">{content.category}</h2>
									<h1 class="chat__article-h1">{content.headline}</h1>

									{#each content.body as paragraph}
										<p class="chat__article-p">{paragraph}</p>
									{/each}

									<nav class="chat__publish">
										<FormButton
											label="Publish"
											type="submit"
											sentiment={Sentiment.POSITIVE}
											isCompact={true}
										/>
									</nav>
								</article>
							</div>
						{/if}
					</div>
				</li>
			{/each}

		{/if}
	</ul>

	<footer class="chat__footer">
		<div class="chat__container chat__container--footer">
			{#if suggestions && prompt === ''}
				<nav class="chat__suggestions" transition:slide={{ duration: 150 }}>
					{#each suggestions as suggestion}
						<button
							on:click={() => setSuggestion(suggestion)}
							type="button"
							disabled={prompt !== ''}
							class="chat_suggestion"
						>
							{suggestion}
						</button>
					{/each}
				</nav>
			{/if}

			<nav class="chat__prompt">
				<!-- <button>New article</button> -->
				<form
					class={`chat__form chat__form--${isLoading ? 'loading' : ''}`}
					method="POST"
					action="?/generate"
					use:enhance={submitGenerate}
				>
					{#if article}
						<input type="hidden" name="articleId" value={article.id} />
					{/if}

					<textarea
						class="chat__textarea"
						name="prompt"
						placeholder={article
							? 'e.g. "make it a bit longer"'
							: 'e.g. "write an opinion piece about kids these days in a sarcastic tone"'}
						bind:this={textareaRef}
						bind:value={prompt}
						disabled={isLoading}
					/>
					<button class="chat__button-generate" type="submit" disabled={!prompt}>
						{#if isLoading}
							<Loading />
						{:else}
							<SubmitPrompt isDisabled={!prompt} />
						{/if}
					</button>
				</form>
			</nav>
		</div>
	</footer>
</div>

<style lang="scss">
	div.chat {
		display: grid;
		grid-template-rows: auto max-content;
		color: var(--color-neutral-100);
		flex-grow: 1;
		/* height: 100dvh; */
	}

	div.chat__container {
		max-width: 1280px;
		margin-inline: auto;
	}

	ul.chat__messages {
		list-style: none;
		margin-block: 0;
		padding-inline: 0;
		max-height: 100%;
	}

	div.chat__message {
		display: grid;
		grid-template-columns: max-content auto;
		gap: 16px;
		font-size: 16px;
		padding: 24px;

		&--assistant {
			/* background-color: var(--color-primary-darkest); */
			background-color: var(--color-secondary-darkest);
		}
	}

	p.chat__content {
		margin-block: 0;

		&--user {
			color: var(--color-primary);
		}

		&--assistant {
			color: var(--color-secondary);
		}
	}

	div.chat__assistant-response {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	nav.chat__publish {
		width: max-content;
		margin-top: 12px;
	}

	article.chat__article {
		display: flex;
		flex-direction: column;
		gap: 12px;
		/* border: 1px solid var(--color-neutral-500);
		background-color: var(--color-neutral-1000);
		border-radius: var(--border-radius-l);
		padding: 24px; */
		border-left: 2px solid var(--color-secondary);
		/* background-color: var(--color-neutral-1000);
		border-radius: var(--border-radius-l); */
		padding-left: 24px;
	}

	h1.chat__article-h1 {
		font-weight: 600;
		letter-spacing: -0.025em;
		margin-block: 0;
		font-size: 24px;
		line-height: 1.2em;
		color: var(--color-neutral-100);
	}

	h2.chat__article-h2 {
		font-size: 14px;
		font-weight: 600;
		margin-block: 0;
		/* color: var(--color-primary); */
	}

	p.chat__article-p {
		margin-block: 0;
		font-size: 14px;
		line-height: 1.5em;
		color: var(--color-neutral-200);
	}

	/* ------------------------------------------------------------------------ */

	footer.chat__footer {
		position: sticky;
		bottom: 0;
		background: transparent;
		background-image: linear-gradient(0deg, var(--color-neutral-800) 0%, transparent 100%);
		padding: 16px;
	}

	div.chat__container--footer {
		display: grid;
		flex-direction: column;
		gap: 16px;
	}

	nav.chat__suggestions {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		padding-inline: 0;
		gap: 8px;
	}

	button.chat_suggestion {
		padding: 8px;
		background-color: transparent;
		border-radius: 4px;
		text-align: left;
		cursor: pointer;
		font-size: 16px;
		font-family: var(--font-sans);
		border: 1px solid var(--color-secondary-darkest);
		background-color: var(--color-secondary-darkest);
		color: var(--color-secondary);

		&:hover {
			border: 1px solid var(--color-secondary-dark);
		}
	}

	nav.chat__prompt {
		display: flex;
		flex-grow: 1;
		gap: 32px;
	}

	form.chat__form {
		display: flex;
		flex-grow: 1;
		gap: 8px;
		padding: 8px;
		border-radius: var(--border-radius-l);
		border: 1px solid var(--color-neutral-500);
		background-color: var(--color-neutral-700);

		&:not(.chat__form--loading) {
			&:focus-within {
				border-color: var(--color-primary-dark);
			}
		}
	}

	textarea.chat__textarea {
		flex-grow: 1;
		border: 0;
		line-height: 1.25em;
		font-size: 16px;
		background: transparent;
		resize: none;
		box-sizing: border-box;
		font-family: var(--font-sans);
		color: var(--color-neutral-100);

		&:active,
		&:focus {
			outline: 0;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0); // Removes outline on iOS
		}

		&::placeholder {
			color: var(--color-neutral-400);
		}
	}

	button.chat__button-generate {
		cursor: pointer;
		border: 0;
		background: transparent;

		&:active {
			transform: scale(0.95);
		}

		&:disabled {
			cursor: not-allowed;
		}
	}
</style>
