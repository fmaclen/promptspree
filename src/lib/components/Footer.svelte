<script>
	import A from '$lib/components/A.svelte';
	import { CURRENT_MODEL } from '$lib/openai';
	import { APP_NAME } from '$lib/utils';
	import ArticleCategories from './ArticleCategories.svelte';
	import Isologo from './Isologo.svelte';
</script>

<footer class="footer">
	<div class="footer__container">
    <a href="/">
      <Isologo />
    </a>
    <div class="footer__about">
      <p class="footer__p">
        {APP_NAME} is an open-source project designed as a platform for testing and exploring generative
        AI technologies.
      </p>
      <p class="footer__p">
        Articles are currently being generated with <strong>{CURRENT_MODEL}</strong> by
        <strong>OpenAI</strong>.
      </p>
      <p class="footer__p">
        Source code is available on
        <A target="_blank" href="https://github.com/fmaclen/promptspree/">GitHub</A>
        under the Apache 2.0 license.
      </p>
    </div>

    <nav class="footer__link-groups">
      <div class="footer__link-group">
        <h4 class="footer__link-group-title">Categories</h4>
        <ArticleCategories component="link" />
      </div>
      <div class="footer__link-group">
        <h4 class="footer__link-group-title">About</h4>
        <A href="/legal/">Terms of service</A>
        <A href="/legal/">Privacy policy</A>
      </div>
      <div class="footer__link-group">
        <h4 class="footer__link-group-title">Elsewhere</h4>
        <A target="_blank" href="https://github.com/fmaclen/promptspree/">GitHub</A>
        <A target="_blank" href="https://twitter.com/fmaclen">Twitter</A>
      </div>
    </nav>
	</div>
</footer>

<style lang="scss">
	footer.footer {
		@include container-outer;
		color: var(--color-neutral-100);
		background-color: var(--color-neutral-900);
	}

	div.footer__container {
		@include container-inner;
		padding-block: 56px;
    display: grid;
    grid-template-columns: auto 1fr max-content;
    justify-content: space-between;
    gap: 64px;

    @media (max-width: 1024px) {
      grid-template-columns: auto 1fr 1fr;
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 24px;
    }
	}

  p.footer__p {
    @include paragraph-xs;
    line-height: 1.3em;
    color: var(--color-neutral-300)
  }

  div.footer__about {
    display: flex;
    flex-direction: column;
    max-width: 280px;
    gap: 16px;

    @media (max-width: 1024px) {
      max-width: unset;
    }
  }

  nav.footer__link-groups {
    display: flex;
    flex-direction: row;
    width: 100%;
    white-space: nowrap;
    gap: 64px;

    @media (max-width: 1024px) {
      flex-direction: column;
      gap: 32px;
    }

    @media (max-width: 640px) {
      padding-top: 24px;
    }
  }
  
  div.footer__link-group {
    @include paragraph-s;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
    max-width: max-content;
  }

  h4.footer__link-group-title {
		@include subtitle-m;
    margin-bottom: 16px;
  }
</style>
