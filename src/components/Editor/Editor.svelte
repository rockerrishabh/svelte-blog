<script lang="ts">
	import { createEditor, ParagraphNode, TextNode } from 'lexical';
	import { mergeRegister } from '@lexical/utils';
	import { registerRichText } from '@lexical/rich-text';
	import { registerHistory, createEmptyHistoryState } from '@lexical/history';
	import { $generateHtmlFromNodes as generateHtmlFromNodes } from '@lexical/html';
	import {
		$getSelection as getSelection,
		$isRangeSelection as isRangeSelection,
		CAN_REDO_COMMAND,
		CAN_UNDO_COMMAND,
		SELECTION_CHANGE_COMMAND
	} from 'lexical';
	import { Theme } from './theme';
	import EditorToolbar from './EditorToolbar.svelte';
	import { onMount } from 'svelte';

	// Reactive states for formatting buttons
	let isBold = $state(false);
	let isItalic = $state(false);
	let isUnderline = $state(false);
	let isStrikethrough = $state(false);
	let canUndo = $state(false);
	let canRedo = $state(false);

	export const ssr = false;

	let title = $state('');
	let htmlContent = $state('');

	const config = {
		namespace: 'MyEditor',
		theme: Theme,
		nodes: [ParagraphNode, TextNode],
		onError: console.error
	};

	let editorRef: HTMLDivElement;
	const editor = createEditor(config);

	// Debounce helper (optional)
	let debounceTimeout: ReturnType<typeof setTimeout>;
	function debounceUpdate(fn: () => void, delay = 50) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			// Ensure that state helpers are called within an active editor state:
			editor.read(() => {
				fn();
			});
		}, delay);
	}

	// Initialize Lexical on mount
	onMount(() => {
		if (editorRef) {
			editor.setRootElement(editorRef);

			mergeRegister(
				registerRichText(editor),
				registerHistory(editor, createEmptyHistoryState(), 300)
			);

			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					// Generate HTML using Lexical's built-in converter
					htmlContent = generateHtmlFromNodes(editor, null);
					// Debounce toolbar update
					debounceUpdate(updateToolbar, 50);
				});
			});

			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_payload, _newEditor) => {
					debounceUpdate(updateToolbar, 50);
					return false;
				},
				1
			);

			editor.registerCommand(
				CAN_UNDO_COMMAND,
				(payload) => {
					canUndo = payload;
					return false;
				},
				1
			);

			editor.registerCommand(
				CAN_REDO_COMMAND,
				(payload) => {
					canRedo = payload;
					return false;
				},
				1
			);
		}
	});

	const updateToolbar = () => {
		editor.read(() => {
			const selection = getSelection();
			if (isRangeSelection(selection)) {
				const newBold = selection.hasFormat('bold');
				const newItalic = selection.hasFormat('italic');
				const newUnderline = selection.hasFormat('underline');
				const newStrikethrough = selection.hasFormat('strikethrough');

				if (newBold !== isBold) isBold = newBold;
				if (newItalic !== isItalic) isItalic = newItalic;
				if (newUnderline !== isUnderline) isUnderline = newUnderline;
				if (newStrikethrough !== isStrikethrough) isStrikethrough = newStrikethrough;
			}
		});
	};
</script>

<main class="mx-auto max-w-6xl p-8">
	<h1 class="mb-4 text-2xl font-bold">Create New Post</h1>

	<!-- Form using SvelteKit's form actions -->
	<form method="POST" class="space-y-4">
		<!-- Title Input -->
		<div class="mb-4">
			<label for="title" class="mb-1 block font-medium">Title</label>
			<input
				id="title"
				name="title"
				type="text"
				bind:value={title}
				placeholder="Post Title"
				required
				class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
			/>
		</div>

		<!-- Editor Toolbar -->
		<EditorToolbar
			{editor}
			{canRedo}
			{canUndo}
			{isBold}
			{isItalic}
			{isUnderline}
			{isStrikethrough}
		/>

		<!-- Lexical Editor for Content -->
		<div class="mb-4">
			<div
				bind:this={editorRef}
				contenteditable
				class="block min-h-[200px] w-full rounded-b-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
			></div>
			<!-- Hidden input for content so that it is included in the form submission -->
			<input type="hidden" name="content" bind:value={htmlContent} />
		</div>

		<!-- Save Button -->
		<button
			type="submit"
			class="mt-4 w-full cursor-pointer rounded-lg bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-sky-900 focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-700"
			aria-label="Submit"
		>
			Save Post
		</button>
	</form>
</main>
