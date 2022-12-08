[
  '1',
  '2',
  '3'
].forEach((id) => {
  const wrap = document.getElementById(`group-${id}`);

  wrap.append(
    createAnchor(id),
    createSpanSeparator(),
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
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(`${location.origin}${location.pathname}group-${id}.ics`)
  })
  return btn;
}

function createAnchor(id) {
  const anch = document.createElement('a');
  anch.textContent = `Група ${id}`;

  const url = new URL(`webcal://${location.hostname}${location.pathname}group-${id}.ics`)
  url.searchParams.append('title', `Відключення Дніпро - Група ${1}`)
  anch.href = url.toString();

  return anch;
}

