<section class="login">
	<h1 class="login__h1">Login</h1>
	<form class="form" action="?/login" method="POST">
		<fieldset class="form__fieldset">
			<label class="form__field">
				E-mail
				<input
					type="email"
					name="email"
					value="steve@example.com"
					class="form__input"
					placeholder="steve@example.com"
				/>
			</label>

			<label class="form__field">
				Password
				<input type="password" name="password" value="1234567890" class="form__input" />
			</label>

			<button type="submit" class="form__button">Login</button>
		</fieldset>
	</form>
</section>

<style lang="scss">
	h1.login__h1 {
		// same as 	h1.homepage__headline
		font-family: 'EB Garamond', 'Georgia', serif;
		font-size: 2.25rem;
		letter-spacing: -0.025em;
		line-height: 1em;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	form.form {
		border: 1px solid #e2e2e2;
		padding: 2rem;
	}

	fieldset.form__fieldset {
		border: none;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 480px;
		margin-inline: auto;
	}

	label.form__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	button.form__button,
	input.form__input {
		font-size: 0.75rem;
		font-family: 'IBM Plex Mono', 'Courier New', monospace;
		display: block;
		width: 100%;
		border: 1px solid transparent;
		background-color: #f4f4f4;
		padding: 1rem;
		box-sizing: border-box;
		color: slateblue;

		&:focus {
			outline: 1px solid slateblue;
			background-color: transparent;
		}
	}

	button.form__button {
		font-weight: 500;
		background-color: #222;
		border: 1px solid #e2e2e2;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
		font-weight: 700;
		color: #fff;

		&:hover {
			background-color: slateblue;
		}
	}
</style>
