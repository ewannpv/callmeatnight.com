const sizes = [1,1,2,3,4];

//get random position between 1 - 100;
function randomPosition(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const stars = document.getElementById("left_section");

for (let i = 0; i < 200; i++) {
  const top = randomPosition(1,98);
  const left = randomPosition(1,98);
  const random = Math.floor(Math.random() * sizes.length);
  const randomSize = sizes[random];
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.top = top +'%';
  div.style.left = left + '%';
  div.style.height = randomSize +'px';
  div.style.width = randomSize +'px';
  div.style.backgroundColor = "#FFFFFF";
  div.style.borderRadius = '50%';
  if (i <= 50) {
      div.classList.add('star1');
  }
  if (i <= 100 && i > 50) {
      div.classList.add('star2');
  }
  if (i <= 150 && i > 100) {
      div.classList.add('star3');
  }
  if (i <= 200 && i > 150) {
      div.classList.add('star4');
  }
  if (i <= 250 && i > 200) {
      div.classList.add('star5');
  }
  if (i <= 300 && i > 250) {
      div.classList.add('star6');
  }
  stars.appendChild(div);
}

