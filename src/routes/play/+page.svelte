<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { type Article, getRandomInitialSuggestions } from '$lib/articles';
	import Category from '$lib/components/Category.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import Head from '$lib/components/Head.svelte';
	import Broom from '$lib/components/icons/Broom.svelte';
	import Human from '$lib/components/icons/Human.svelte';
	import Loading from '$lib/components/icons/Loading.svelte';
	import Robot from '$lib/components/icons/Robot.svelte';
	import SubmitPrompt from '$lib/components/icons/SubmitPrompt.svelte';
	import { type Message, MessageRole } from '$lib/messages';
	import { Sentiment } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { slide } from 'svelte/transition';

	import type { PageData } from './$types';
	import ToastSuccess from './ToastSuccess.svelte';

	export let data: PageData;

	let article: Article | null = data.article || null;
	let messages: Message[] = data.messages || [];
	let suggestions: string[] = getRandomInitialSuggestions();
	let error: string | null = null;
	let textareaRef: HTMLTextAreaElement;
	let scrollToMessageRef: HTMLDivElement;
	let buttonRef: HTMLButtonElement;

	$: prompt = '';
	$: shouldDisplaySuggestions = !article && suggestions && prompt === '' && !isLoading;
	$: isLoading = false;

	function submitGenerate() {
		messages = [...messages, { role: MessageRole.USER, content: prompt }];
		error = null;
		prompt = '';
		isLoading = true;
		scrollToMessage();
		toast.dismiss();

		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				article = result.data?.article || null;
				messages = result.data?.messages || null;
				suggestions = result.data?.suggestions || [];
				toast.success(ToastSuccess, { userId: article?.user?.id } as any);
			}

			if (result.type === 'failure') {
				error = result.data?.error || null;
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
		if (article) {
			scrollToMessage();
			const { content } = messages[messages.length - 1]; // Gets `content` from Last message
			suggestions = (typeof content !== 'string' && content?.suggestions) || [];
		}

		textareaRef.focus();
	});

	function toggleSuggestions() {
		shouldDisplaySuggestions = true;
	}

	function setSuggestion(suggestion: string) {
		prompt = suggestion;
		textareaRef.focus();
		// HACK: Mostly needed for mobile, the viewport changes dramatically when the
		// keyboard is shown so we wait a bit before scrolling to the textarea.
		setTimeout(() => {
			textareaRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 250);
	}

	function scrollToMessage() {
		// HACK: Wait for the old message ref to be removed and the new one to be rendered.
		setTimeout(() => {
			scrollToMessageRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 250);
	}

	function resetArticle() {
		prompt = '';
		article = null;
		error = null;
		messages = [];
		suggestions = getRandomInitialSuggestions();
		textareaRef.focus();
	}
</script>

<Head title={['Play']} />

<div class="chat">
	<ul class="chat__messages">
		{#if messages}
			{#each messages as message}
				{@const { role, content } = message}
				{@const roleClass = role?.toLowerCase()}
				{@const isLastMessage = messages.indexOf(message) === messages.length - 1}
				{@const isContentArticleCompletion = content && typeof content !== 'string'}

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
						{:else if role === MessageRole.ASSISTANT && isContentArticleCompletion}
							<Robot />
							<div class="chat__assistant-response">
								{#if content.notes}
									<p class={`chat__content chat__content--${roleClass}`}>
										{content.notes}
									</p>
								{/if}

								<article class="chat__article">
									<Category label={content.category} />

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

		{#if isLoading}
			<li class="chat__message-container" transition:slide={{ duration: 150 }}>
				<div class="chat__message chat__message--assistant chat__message--loading">
					<Robot />
					<div class="chat__assistant-response">
						<Loading theme="secondary" />
					</div>
				</div>
			</li>
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
				{#if article}
					<button
						class="chat__button-reset"
						type="button"
						on:click={resetArticle}
						transition:slide={{ duration: 150, axis: 'x' }}
						title="Start from scratch"
						aria-label="Start from scratch"
					>
						<Broom />
					</button>
				{/if}
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
						on:keydown={(event) => event.key === 'Enter' && buttonRef.click()}
						disabled={isLoading}
					/>
					<button
						class="chat__button-generate"
						type="submit"
						disabled={!prompt}
						bind:this={buttonRef}
					>
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
		flex-grow: 1;
		color: var(--color-neutral-100);
	}

	div.chat__container {
		@include container-inner;
	}

	ul.chat__messages {
		@include container-outer;
		display: flex;
		flex-direction: column;
		list-style: none;
		margin-block: 0;
		padding-inline: 0;
		padding-block: 24px;
		max-height: 100%;
		gap: 12px;
	}

	li.chat__message-container {
		@include container-inner;
	}

	div.chat__message {
		@include paragraph-m;
		display: grid;
		grid-template-columns: max-content auto;
		gap: 12px;
		border-radius: var(--border-radius-l);
		padding: 24px;
		box-sizing: border-box;

		&--user {
			background-color: var(--color-green-darkest);
		}

		&--assistant {
			background-color: var(--color-neutral-700);
		}

		&--loading {
			position: relative;
			overflow: hidden;

			&::before {
				position: absolute;
				content: '';
				background-color: rgba(255, 255, 255, 0.05);
				height: 100%;
				width: 90%;
				animation-name: progress-animation;
				animation-duration: 20s;
				animation-timing-function: ease-out;
			}

			@keyframes progress-animation {
				0% {
					width: 0%;
				}
				100% {
					width: 95%;
				}
			}
		}

		@media (max-width: 768px) {
			padding: 16px;
		}
	}

	p.chat__content {
		margin-block: 0;

		&--user {
			color: var(--color-green);
		}

		&--assistant {
			color: var(--color-yellow);
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
		@include paragraph-xs;
		display: flex;
		align-items: center;
		padding-inline: 12px;
		line-height: 1em;
		color: var(--color-neutral-300);
		background-color: var(--color-neutral-600);
		border-radius: var(--border-radius-l);
	}

	article.chat__article {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border-left: 2px solid var(--color-yellow);
		padding-left: 20px;
		box-sizing: border-box;
		width: 50%;

		@media (max-width: 1024px) {
			width: 75%;
		}

		@media (max-width: 768px) {
			width: 100%;
		}
	}

	h1.chat__article-h1 {
		@include headline-l;
		color: var(--color-neutral-100);
	}

	p.chat__article-p {
		@include paragraph-s;
		color: var(--color-neutral-200);
	}

	/* ------------------------------------------------------------------------ */

	footer.chat__footer {
		@include container-outer;
		position: sticky;
		bottom: 0;
		padding-block: 24px;
		backdrop-filter: blur(1px);
		-webkit-backdrop-filter: blur(1px);
		background-color: rgba(25, 25, 25, 0.9);
		border-top: 1px solid var(--color-neutral-700);

		@media (max-width: 768px) {
			padding-block: 16px;
		}
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
		@include paragraph-s;
		line-height: 1em;
		background-color: transparent;
		text-align: left;
		cursor: pointer;
		padding: 8px;
		border-radius: 4px;
		font-family: var(--font-base);
		border: 1px solid var(--color-yellow-darkest);
		background-color: var(--color-yellow-darkest);
		color: var(--color-yellow);

		&:hover {
			border: 1px solid var(--color-yellow-dark);
		}
	}

	nav.chat__prompt {
		display: flex;
		flex-grow: 1;
		gap: 16px;

		@media (max-width: 768px) {
			gap: 8px;
		}
	}

	form.chat__form {
		display: flex;
		flex-grow: 1;
		gap: 8px;
		padding: 8px;
		border-radius: var(--border-radius-l);
		border: 1px solid var(--color-neutral-500);
		background-color: var(--color-neutral-700);
		transition: border-color 0.2s ease-in-out;

		&:not(.chat__form--loading) {
			&:focus-within {
				border-color: var(--color-green-dark);
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
		font-family: var(--font-base);
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

	button.chat__button-reset,
	button.chat__button-generate {
		cursor: pointer;

		&:active {
			transform: scale(0.95);
		}

		&:disabled {
			cursor: not-allowed;
		}
	}

	button.chat__button-generate {
		border: 0;
		background: transparent;
	}

	button.chat__button-reset {
		display: flex;
		align-items: center;
		gap: 12px;
		border: 1px solid var(--color-green-darkest);
		background-color: var(--color-green-darkest);
		border-radius: var(--border-radius-l);
		transition: padding 200ms;
		padding: 12px;

		&:hover {
			padding-left: 24px;
			padding-right: 24px;
		}
	}
</style>
