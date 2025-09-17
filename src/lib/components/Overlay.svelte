<script lang="ts">
	interface Props {
		isOpen: boolean
		onClose: () => void
		title?: string
		children: import('svelte').Snippet
	}

	let { isOpen = false, onClose, title, children }: Props = $props()

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose()
		}
	}
</script>

{#if isOpen}
	<div 
		class="overlay-backdrop" 
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'overlay-title' : undefined}
	>
		<div class="overlay-content">
			{#if title}
				<header class="overlay-header">
					<h2 id="overlay-title">{title}</h2>
					<button class="close-button" onclick={onClose} aria-label="Close overlay">×</button>
				</header>
			{/if}
			<div class="overlay-body">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.overlay-content {
		background-color: var(--background-color, white);
		border-radius: 0.5rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		max-width: 32rem;
		width: 90vw;
		max-height: 80vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.overlay-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
	}

	.overlay-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}

	.close-button:hover {
		opacity: 1;
	}

	.overlay-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}
</style>