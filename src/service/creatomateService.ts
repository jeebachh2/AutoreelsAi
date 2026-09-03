export async function renderRealVideo(
  scenes: { imageUrl: string; timeStart: number; timeEnd: number }[],
  musicTrackId?: string,
  musicQuery?: string,
): Promise<string | null> {
  if (scenes.length === 0) {
    throw new Error('No scenes are available to render.');
  }

  const response = await fetch('/api/render-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenes, musicTrackId, musicQuery }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Video rendering failed (${response.status}).`);
  }

  return data.url || null;
}