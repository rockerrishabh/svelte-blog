<script lang="ts">
	import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND, type LexicalEditor } from 'lexical';

	let {
		editor,
		canUndo,
		canRedo,
		isBold,
		isItalic,
		isUnderline,
		isStrikethrough
	}: {
		editor: LexicalEditor;
		canUndo: boolean;
		canRedo: boolean;
		isBold: boolean;
		isItalic: boolean;
		isUnderline: boolean;
		isStrikethrough: boolean;
	} = $props();

	function formatBold() {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
	}
	function formatItalic() {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
	}
	function formatUnderline() {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
	}
	function formatStrikethrough() {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
	}

	// History commands
	function undo() {
		editor.dispatchCommand(UNDO_COMMAND, undefined);
	}
	function redo() {
		editor.dispatchCommand(REDO_COMMAND, undefined);
	}
</script>

<!-- Toolbar -->
<div
	class="mb-2 flex flex-wrap gap-1 rounded-t-md border border-slate-300 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-700"
>
	<!-- History Controls -->
	<button
		type="button"
		onclick={undo}
		disabled={!canUndo}
		class="cursor-pointer rounded p-2 hover:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent dark:hover:bg-slate-600"
		aria-label="Undo"
		title="Undo"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M3 7v6h6"></path>
			<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
		</svg>
	</button>
	<button
		type="button"
		onclick={redo}
		disabled={!canRedo}
		class="cursor-pointer rounded p-2 hover:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent dark:hover:bg-slate-600"
		aria-label="Redo"
		title="Redo"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M21 7v6h-6"></path>
			<path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path>
		</svg>
	</button>

	<div class="mx-2 h-6 border-r border-slate-300 dark:border-slate-600"></div>

	<!-- Text Formatting -->
	<button
		type="button"
		onclick={formatBold}
		class={`cursor-pointer rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-600 ${isBold ? 'bg-slate-200 dark:bg-slate-600' : ''}`}
		aria-label="Format Bold"
		title="Bold"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
			<path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
		</svg>
	</button>
	<button
		type="button"
		onclick={formatItalic}
		class={`cursor-pointer rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-600 ${isItalic ? 'bg-slate-200 dark:bg-slate-600' : ''}`}
		aria-label="Format Italic"
		title="Italic"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="19" y1="4" x2="10" y2="4"></line>
			<line x1="14" y1="20" x2="5" y2="20"></line>
			<line x1="15" y1="4" x2="9" y2="20"></line>
		</svg>
	</button>
	<button
		type="button"
		onclick={formatUnderline}
		class={`cursor-pointer rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-600 ${isUnderline ? 'bg-slate-200 dark:bg-slate-600' : ''}`}
		aria-label="Format Underline"
		title="Underline"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
			<line x1="4" y1="21" x2="20" y2="21"></line>
		</svg>
	</button>
	<button
		type="button"
		onclick={formatStrikethrough}
		class={`cursor-pointer rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-600 ${isStrikethrough ? 'bg-slate-200 dark:bg-slate-600' : ''}`}
		aria-label="Format Strikethrough"
		title="Strikethrough"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="4" y1="12" x2="20" y2="12"></line>
			<line x1="9" y1="5.5" x2="9" y2="18.5"></line>
			<line x1="15" y1="5.5" x2="15" y2="18.5"></line>
		</svg>
	</button>
</div>
