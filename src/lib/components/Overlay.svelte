<script lang="ts">
	interface Props {
		isOpen: boolean
		onClose: () => void
		title?: string
		children: import('svelte').Snippet
		showBackdrop?: boolean
		anchorElement?: HTMLElement
	}

	let { isOpen = false, onClose, title, children, showBackdrop = true, anchorElement }: Props = $props()

	let overlayContent: HTMLDivElement

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

	function positionOverlay() {
		if (!anchorElement || !overlayContent) return

		const rect = anchorElement.getBoundingClientRect()
		const overlayRect = overlayContent.getBoundingClientRect()
		
		// Position below the anchor element by default
		let top = rect.bottom + 8
		let left = rect.left
		
		// Check if overlay would go off the right edge
		if (left + overlayRect.width > window.innerWidth) {
			left = window.innerWidth - overlayRect.width - 16
		}
		
		// Check if overlay would go off the bottom edge
		if (top + overlayRect.height > window.innerHeight) {
			top = rect.top - overlayRect.height - 8
		}
		
		// Ensure minimum margins
		left = Math.max(16, left)
		top = Math.max(16, top)
		
		overlayContent.style.position = 'fixed'
		overlayContent.style.top = `${top}px`
		overlayContent.style.left = `${left}px`
		overlayContent.style.transform = 'none'
	}

	$effect(() => {
		if (isOpen && anchorElement) {
			// Position after the DOM has updated
			setTimeout(positionOverlay, 0)
		}
	})

	$effect(() => {
		if (!showBackdrop && isOpen) {
			function handleClickOutside(event: MouseEvent) {
				if (overlayContent && !overlayContent.contains(event.target as Node) && 
					anchorElement && !anchorElement.contains(event.target as Node)) {
					onClose()
				}
			}

			document.addEventListener('click', handleClickOutside)
			return () => document.removeEventListener('click', handleClickOutside)
		}
	})
</script>

{#if isOpen}
	{#if showBackdrop}
		<div 
			class="overlay-backdrop" 
			onclick={handleBackdropClick}
			onkeydown={handleKeydown}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'overlay-title' : undefined}
		>
			<div class="overlay-content" bind:this={overlayContent} class:positioned={anchorElement}>
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
	{:else}
		<div 
			class="overlay-content positioned"
			bind:this={overlayContent}
			onkeydown={handleKeydown}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'overlay-title' : undefined}
		>
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
	{/if}
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

	.overlay-content.positioned {
		position: fixed;
		z-index: 1000;
		max-width: 24rem;
		width: auto;
		min-width: 16rem;
		max-height: 70vh;
	}
</style>