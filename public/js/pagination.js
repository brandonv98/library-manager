const rows = document.querySelectorAll('tbody tr');
const recordsPerPage = 20;
let currentPage = 1;
console.log(`Total records: ${rows.length}`);

let pagesNeeded = Math.ceil(rows.length / recordsPerPage);
console.log(`Records per page: ${recordsPerPage}`);
console.log(`Pages needed: ${pagesNeeded}`);

// create outer div
const div = document.createElement('div')
div.className = 'pagination';

// create ul
const ul = document.createElement('ul');
div.appendChild(ul);

document
  .querySelector('body')
  .appendChild(div);
// debugger;
for (let i = 0; i < pagesNeeded; i++) {
  // Show pagination links if pages needed is greater then 1
  if (pagesNeeded > 1) {
    let anchor = `<a class="button" href="#">${i + 1}</a>`
    let li = document.createElement('li');
    li.innerHTML = anchor;

    // append each link inside the ul
    ul.appendChild(li);
    document
      .querySelector('.pagination ul')
      .getElementsByTagName('a')[currentPage - 1]
      .classList
      .add('active');
  }
}

function showPage(list, page, recordsPerPage) {
  for (let i = 0; i < list.length; i++) {
    if (i >= (page * recordsPerPage) - recordsPerPage && i < (page * recordsPerPage)) {
      // if records are within range display
      list[i].style.display = '';
    } else {
      // if records fall outside of range hide
      list[i].style.display = 'none';
    }
  }
}

showPage(rows, currentPage, recordsPerPage);

document
  .querySelector('.pagination ul')
  .addEventListener('click', e => {
    e.preventDefault();
    if (event.target.nodeName === 'A') {
      let anchors = document.querySelectorAll('.pagination li a');
      // loop over pagination links to remove active class from all
      for (let i = 0; i < anchors.length; i++) {
        anchors[i]
          .classList
          .remove('active');
        //  Assign active to button clicked
        e
          .target
          .classList
          .add('active');
      }
      currentPage = e.target.innerHTML;
      showPage(rows, currentPage, recordsPerPage);
    }
  });