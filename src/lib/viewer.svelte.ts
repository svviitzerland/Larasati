/** State of the closer view for the gallery. */
export const viewer = $state({ open: false, index: 0 });

export function openViewer(index: number) {
	viewer.index = index;
	viewer.open = true;
}

export function closeViewer() {
	viewer.open = false;
}
