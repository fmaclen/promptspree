<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { type Article, getRandomInitialSuggestions } from '$lib/articles';
	import FormButton from '$lib/components/FormButton.svelte';
	import Human from '$lib/components/icons/Human.svelte';
	import Loading from '$lib/components/icons/Loading.svelte';
	import Robot from '$lib/components/icons/Robot.svelte';
	import SubmitPrompt from '$lib/components/icons/SubmitPrompt.svelte';
	import { type Message, MessageRole } from '$lib/messages';
	import { Sentiment } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import { slide } from 'svelte/transition';

	import type { PageData } from './$types';
	import ToastSuccess from './ToastSuccess.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	let article: Article | null = data.article ?? null;
	let messages: Message[] = data.messages ?? [];
	let suggestions: string[] = getRandomInitialSuggestions();
	let error: string | null = null;
	let fieldError: string[] | null = null;
	let textareaRef: HTMLTextAreaElement;
	let scrollToMessageRef: HTMLDivElement;

	$: prompt = '';
	$: isLoading = false;
	$: shouldDisplaySuggestions = !article && suggestions && prompt === '' && !isLoading;

	function submitGenerate() {
		messages = [...messages, { role: MessageRole.USER, content: prompt }];
		scrollToMessage();
		toast.dismiss();
		isLoading = true;
		error = null;
		fieldError = null;
		prompt = '';

		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				article = result.data?.article || null;
				messages = result.data?.messages || null;
				suggestions = result.data?.suggestions || [];
				toast.success(ToastSuccess, { userId: article?.user?.id } as any);
			}

			if (result.type === 'failure') {
				error = result.data?.error || null;
				fieldError = result.data?.fieldError || null;
				toast.error(error);
				await applyAction(result);
			}

			update();
			scrollToMessage();
			isLoading = false;
			prompt = '';
		};
	}

	onMount(() => {
		if (article) scrollToMessage();
		textareaRef.focus();
	});

	function toggleSuggestions() {
		shouldDisplaySuggestions = true;
	}

	function setSuggestion(suggestion: string) {
		prompt = suggestion;
		textareaRef.focus();
		setTimeout(() => {
			textareaRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 250);
	}

	function scrollToMessage() {
		setTimeout(() => {
			scrollToMessageRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 250);
	}
</script>

<div class="chat">
	<ul class="chat__messages">
		{#if messages}
			{#each messages as message}
				{@const { role, content } = message}
				{@const roleClass = role?.toLowerCase()}
				{@const isLastMessage = messages.indexOf(message) === messages.length - 1}

				<li class="chat__message-container" transition:slide={{ duration: 150 }}>
					{#if isLastMessage}
						<div bind:this={scrollToMessageRef} />
					{/if}

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

									<form class="chat__publish" method="POST" action="?/publish">
										<input type="hidden" name="articleId" value={article?.id} />
										<input type="hidden" name="messageId" value={message.id} />
										<FormButton
											label="Publish"
											type="submit"
											sentiment={Sentiment.POSITIVE}
											isCompact={true}
										/>
										{#if isLastMessage}
											<span class="chat__latest-version">Latest version</span>
										{/if}
									</form>
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
			{#if shouldDisplaySuggestions}
				<nav class="chat__suggestions" transition:slide={{ duration: 150 }}>
					{#each suggestions as suggestion}
						<button
							on:click={() => setSuggestion(suggestion)}
							type="button"
							class="chat__suggestion"
							disabled={prompt !== ''}
						>
							{suggestion}
						</button>
					{/each}
				</nav>
			{/if}

			<nav class="chat__prompt">
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
						placeholder={'Type your prompt here...'}
						bind:this={textareaRef}
						bind:value={prompt}
						on:click={toggleSuggestions}
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
	}

	div.chat__container {
		max-width: 1280px;
		margin-inline: auto;
	}

	ul.chat__messages {
		display: flex;
		flex-direction: column;
		list-style: none;
		margin-block: 0;
		padding-inline: 0;
		max-height: 100%;
		padding: 24px;

		--gap: 12px;
		gap: var(--gap);
	}

	div.chat__message {
		display: grid;
		grid-template-columns: max-content auto;
		gap: 12px;
		font-size: 16px;
		padding: 16px;
		max-width: 1280px;
		box-sizing: border-box;
		margin-inline: auto;
		border-radius: var(--border-radius-l);

		&--user {
			background-color: var(--color-primary-darkest);
		}

		&--assistant {
			background-color: var(--color-neutral-700);
		}

		@media (min-width: 768px) {
			padding: 32px;
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
		gap: 20px;
	}

	form.chat__publish {
		display: grid;
		grid-template-columns: max-content auto;
		gap: 8px;
		margin-top: 12px;
	}

	span.chat__latest-version {
		display: flex;
		font-size: 14px;
		align-items: center;
		padding-inline: 12px;
		color: var(--color-neutral-300);
		background-color: var(--color-neutral-600);
		border-radius: var(--border-radius-l);
	}

	article.chat__article {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border-left: 2px solid var(--color-secondary);
		padding-left: 20px;
		box-sizing: border-box;
		width: 100%;

		@media (min-width: 768px) {
			width: 75%;
		}

		@media (min-width: 1024px) {
			width: 50%;
		}
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
		padding: 24px;
		backdrop-filter: blur(1px);
		-webkit-backdrop-filter: blur(1px);
		background-color: rgba(25, 25, 25, 0.9);
		border-top: 1px solid var(--color-neutral-700);
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

	button.chat__suggestion {
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
