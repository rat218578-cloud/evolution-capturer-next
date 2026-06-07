export function buildGameSocketUrl({ host = 'localhost:3000', gameId, token }) {
  const params = new URLSearchParams({ messageFormat: 'json', token });
  return `ws://${host}/api/websocket?gameId=${encodeURIComponent(gameId)}&${params.toString()}`;
}

export function closeSocket(socket) {
  if (socket && socket.readyState <= 1) {
    socket.close();
  }
}
