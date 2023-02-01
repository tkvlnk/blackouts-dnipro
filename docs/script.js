[
  '1',
  '2',
  '3'
].forEach((id) => {
  const wrap = document.getElementById(`group-${id}`);

  wrap.append(
    createAnchor(id),
    createButton(id)
  )
})

function createSpanSeparator() {
  const elem = document.createElement('span');
  elem.innerHTML = `&nbsp;`
  return elem;
}

function createButton(id) {
  const btn = document.createElement('button');
  btn.textContent = `Koпіювати посилання`;
  btn.className = 'bg-indigo-500 text-white p-2 rounded-lg'
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(`${location.origin}${location.pathname}group-${id}.ics`)
  });
  return btn;
}

function createAnchor(id) {
  const anch = document.createElement('a');
  anch.textContent = `Група ${id} - Додати в календар`;

  const url = new URL(`webcal://${location.hostname}${location.pathname}group-${id}.ics`)
  url.searchParams.append('ts', Date.now().toString())
  anch.href = url.toString();
  anch.target = '_blank';
  anch.className = 'text-indigo-700 underline'

  return anch;
}

