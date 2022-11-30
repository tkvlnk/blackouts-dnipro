[
  '1',
  '2',
  '3'
].forEach((id) => {
  const btn = document.getElementById(`group-${id}`);

  btn.textContent = `Група ${id} - Koпіювати посилання`;

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(`${location.origin}${location.pathname}group-${id}.ics`)
  })
})
