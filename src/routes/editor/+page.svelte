<script lang="ts">
	import { ArticleSize } from '../../lib/articles';
	import ArticleBody from '../../lib/components/ArticleBody.svelte';
	import ArticleHeader from '../../lib/components/ArticleHeader.svelte';
	import { MessageRole } from '../../lib/messages';
	import type { PageData } from './$types';

	export let data: PageData;

	let article = data.article;
</script>

<div class="chat">
	<ul class="chat__messages">
		{#if article}
			{#each article.messages as message}
				<li class="chat__message">
					<div class="chat__container">
						<strong>{message.role}</strong>

						{#if message.role === MessageRole.USER}
							<p>{message.content}</p>
						{:else if message.role === MessageRole.ASSISTANT}
							<p>{message.content.notes}</p>

							<article>
								<ArticleHeader
									article={{ ...article, headline: message.content.headline }}
									size={ArticleSize.FULL}
								/>
								<ArticleBody
									article={{ ...article, body: message.content.body }}
									size={ArticleSize.FULL}
								/>
							</article>
							<nav>
								<button>Publish</button>
							</nav>
						{/if}
					</div>
				</li>
			{/each}
		{/if}
	</ul>

	<footer class="chat__footer">
		<div class="chat__container">
			<nav class="chat__suggestions">
				<button class="chat_suggestion">Suggestion</button>
				<button class="chat_suggestion">Suggestion</button>
				<button class="chat_suggestion">Suggestion</button>
			</nav>
		</div>

		<div class="chat__container">
			<nav class="chat__prompt">
				<button>New article</button>
				<form class="chat__form">
					<textarea class="chat__textarea" placeholder="Type your message here" />
					<button>Send</button>
				</form>
			</nav>
		</div>
	</footer>
</div>

<style lang="scss">
	/* p {
		margin: 0;
	} */

	article {
		border: 1px solid var(--color-neutral-500);
		background-color: var(--color-neutral-1000);
		padding: 24px;
	}

	/* ------------------------------------------------------------------------ */

	div.chat {
		display: flex;
		flex-direction: column;
		color: var(--color-neutral-100);
		flex-grow: 1;
	}

	div.chat__container {
		max-width: 1280px;
		margin-inline: auto;
	}

	ul.chat__messages {
		list-style: none;
		margin-block: 0;
		padding-inline: 0;
		flex-grow: 1;
	}

	li.chat__message {
		padding: 24px;

		&:nth-child(odd) {
			/* background-color: var(--color-neutral-800); */
		}

		&:nth-child(even) {
			background-color: var(--color-primary-darkest);
		}
	}

	/* ------------------------------------------------------------------------ */

	footer.chat__footer {
		/* background: var(--color-neutral-900); */
		background-image: linear-gradient(0deg, var(--color-neutral-1000) 0%, transparent 100%);
		padding: 24px;
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
		border: 1px solid var(--color-neutral-500);
		border-radius: 4px;
	}

	nav.chat__prompt {
		display: flex;
		width: 100%;
		gap: 32px;
	}

	form.chat__form {
		display: flex;
		flex-grow: 1;
		gap: 8px;
	}

	textarea.chat__textarea {
		flex-grow: 1;
	}
</style>
