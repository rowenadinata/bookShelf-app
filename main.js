const bookShelf = [];
const RENDER_EVENT = 'render-bookList';
const SAVED_EVENT = 'saved-bookList';
const STORAGE_KEY = 'BOOKSHELF_APPS';

// Render Event
document.addEventListener(RENDER_EVENT, function () {
	const unfinishedReadBook = document.getElementById('incompleteBookshelfList');
	unfinishedReadBook.innerHTML = '';

	const finishedReadBook = document.getElementById('completeBookshelfList');
	finishedReadBook.innerHTML = '';
 
	for (const bookItem of bookShelf) {
		const bookElement = makeBook(bookItem);
		if (!bookItem.isFinished)
			unfinishedReadBook.append(bookElement);
		else
			finishedReadBook.append(bookElement);
	}
});

//  DOM Section
document.addEventListener('DOMContentLoaded', function () {
	const submitBook = document.getElementById('inputBook');
	submitBook.addEventListener('submit', function (event) {
		event.preventDefault();
		addBook();

		const inputToast = document.getElementById('snackbar');
		inputToast.innerText =  'You just added a new book';
		toast();
	});

	const searchingBook = document.getElementById('searchBook');
	searchingBook.addEventListener('submit', function (event) {
		event.preventDefault();
		searchBook();
	});

	// mengganti button submit saat checkbox dicentang
	const checkBoxFinished = document.getElementById('inputBookIsComplete');
	const submitButton = document.querySelector('#bookSubmit');
	checkBoxFinished.addEventListener('change', function (event) {
		if (this.checked) {
			submitButton.innerText = 'Insert a book to finished section';
		} else {
			submitButton.innerText = 'Insert a book to unfinished section';
		}
	});

	// tambahan untuk event Local Storage
	if (isStorageExist()) {
		loadDataFromStorage();
	}
	
});

// Event listener untuk data storage 
document.addEventListener(saveData, function() { 
	console.log(localStorage.getItem(STORAGE_KEY));
});

function addBook() {
	const bookTitle = document.getElementById('inputBookTitle').value;
	const bookAuthor = document.getElementById('inputBookAuthor').value;
	const publishedYear = document.getElementById('inputBookYear').value;
	const finishedBook = document.getElementById('inputBookIsComplete').checked;

	// mengecek apakah input buku sudah selesai dibaca atau belum
	if (finishedBook.checked) return;

	const generatedID = generateId();
	const bookDetail = generateBookDetail(generatedID, bookTitle, bookAuthor, publishedYear, finishedBook);
	bookShelf.push(bookDetail);

	document.dispatchEvent(new Event(RENDER_EVENT));
	// untuk fungsi save ke local storage
	saveData();
}

// function untuk search judul buku 
function searchBook() {
	let input, filter, bookListComplete, bookListItemComplete, bookListIncomplete, bookListItemIncomplete, bookItemTitle, iteration, inputValue;
	input = document.getElementById('searchBookTitle');
	filter = input.value.toUpperCase();

	bookListComplete = document.getElementById('completeBookshelfList');
	bookListItemComplete = bookListComplete.getElementsByTagName('article');
	for (iteration = 0; iteration < bookListItemComplete.length; iteration++) {
		bookItemTitle = bookListItemComplete[iteration].getElementsByTagName('h3')[0];
		inputValue = bookItemTitle.textContent || bookItemTitle.innerText;
		if (inputValue.toUpperCase().indexOf(filter) > -1) {
			bookListItemComplete[iteration].style.display = '';
		} else {
			bookListItemComplete[iteration].style.display = 'none';
		}
	}

	bookListIncomplete = document.getElementById('incompleteBookshelfList');
	bookListItemIncomplete = bookListIncomplete.getElementsByTagName('article');
	for (iteration = 0; iteration < bookListItemIncomplete.length; iteration++) {
		bookItemTitle = bookListItemIncomplete[iteration].getElementsByTagName('h3')[0];
		inputValue = bookItemTitle.textContent || bookItemTitle.innerText;
		if (inputValue.toUpperCase().indexOf(filter) > -1) {
			bookListItemIncomplete[iteration].style.display = '';
		} else {
			bookListItemIncomplete[iteration].style.display = 'none';
		}
	
	}
}

function generateId() {
	return +new Date();
}

function generateBookDetail(id, title, author, year, isFinished) {
	return {
		id,
		title,
		author,
		year,
		isFinished,
	}
}

function makeBook(bookDetail) {
	const bookTitle = document.createElement('h3');
	bookTitle.innerText = bookDetail.title;

	const bookAuthor = document.createElement('p');
	bookAuthor.innerText = 'Author: ' + bookDetail.author;

	const publishedYear = document.createElement('p');
	publishedYear.innerText = 'Published Year: ' + bookDetail.year;

	const actionContainer = document.createElement('div');
	actionContainer.classList.add('action');

	const innerContainer = document.createElement('section');
	innerContainer.classList.add('inner_container');
	innerContainer.append(bookTitle, bookAuthor, publishedYear, actionContainer);

	// Container Book Item
	const container = document.createElement('article');
	container.classList.add('book_item');
	container.append(innerContainer);
	container.setAttribute('id', `book-${bookDetail.id}`)

	if (bookDetail.isFinished) {

		const unfinishedButton = document.createElement('button')
		unfinishedButton.classList.add('black');
		unfinishedButton.innerText = 'Not Finished Yet';

		unfinishedButton.addEventListener('click', function () {
			unfinishedReading(bookDetail.id);
			const unfinishedToast = document.getElementById('snackbar');
			unfinishedToast.innerText =  bookDetail.title + ' move to unfinished section';
			toast();
		});

		actionContainer.append(unfinishedButton);
	} else {
		const finishedButton = document.createElement('button');
		finishedButton.classList.add('black');
		finishedButton.innerText = 'Finished!';

		finishedButton.addEventListener('click', function () {
			finishedReading(bookDetail.id);
			const finishedToast = document.getElementById('snackbar');
			finishedToast.innerText =  bookDetail.title + ' move to finished section';
			toast();
		});

		actionContainer.append(finishedButton);
	}

	// Edit Section
	const editButton = document.createElement('button');
	editButton.classList.add('grey','edit_button');
	editButton.innerText = 'Edit';

	editButton.addEventListener('click', function () {
		const bookId = bookDetail.id
		innerContainer.style.display = 'none';
		const editSection = container.innerHTML += '<section class="edit_section"><h2>Edit Book Form</h2></section>';
		editForm();

		function editForm() {

			const editTitle = document.createElement('input', 'text');
			editTitle.id = 'editTitle';
			editTitle.placeholder = 'Title';
			editTitle.required = true;
			editTitle.value = bookDetail.title;

			const editAuthor = document.createElement('input', 'text');
			editAuthor.id = 'editAuthor';
			editTitle.placeholder = 'Author';
			editAuthor.required = true;
			editAuthor.value = bookDetail.author;

			const editYear = document.createElement('input', 'text');
			editYear.id= 'editYear';
			editYear.placeholder = 'Published Year';
			editYear.required = true;
			editYear.value = bookDetail.year;

			const inputDiv = document.createElement('div');
			inputDiv.classList.add('input');
			inputDiv.append(editTitle, editAuthor, editYear);

			const editActionContainer = document.createElement('div');
			editActionContainer.classList.add('action');

			const editCancelButton = document.createElement('button');
			editCancelButton.classList.add('black', 'cancel_button');
			editCancelButton.innerText = 'Cancel';

			const editSaveButton = document.createElement('button');
			editSaveButton.classList.add('white');
			editSaveButton.setAttribute('type', 'submit');
			editSaveButton.innerText = 'Save';

			editActionContainer.append(editCancelButton,editSaveButton);

			const editForm = document.createElement('form')
			editForm.id = 'editForm';
			editForm.append(inputDiv, editActionContainer);
			
			const editSection = document.querySelectorAll('.edit_section');
			for( let i = 0; i < editSection.length; i++) {
				editSection[i].append(editForm);
			}

			return editSection;
		}

		const cancelButton = document.querySelectorAll('.cancel_button');
		for (let n = 0; n < cancelButton.length; n++) {
			cancelButton[n].addEventListener('click', function() {
				event.preventDefault();

				const editSection = document.querySelectorAll('.edit_section');
				for( let i = 0; i < editSection.length; i++) {
					editSection[i].style.display = 'none';
				}
				const innerContainer = document.querySelectorAll('.inner_container');
				for (let j = 0; j < innerContainer.length; j++) {
					innerContainer[j].style.display = 'block';
				}
			});
		}

		const editBookForm = document.getElementById('editForm');
		editBookForm.addEventListener('submit', function(event) {

			event.preventDefault();

			const editSection = document.querySelectorAll('.edit_section');
			for( let i = 0; i < editSection.length; i++) {
				editSection[i].style.display = 'none';
			}
			const innerContainer = document.querySelectorAll('.inner_container');
			for (let j = 0; j < innerContainer.length; j++) {
				innerContainer[j].style.display = 'block';
			}
			editBook(bookDetail.id);

		});
	});
	
	const deleteButton = document.createElement('button');
	deleteButton.classList.add('grey');
	deleteButton.innerText = 'Delete';
	
	deleteButton.addEventListener('click', function () {
		deleteBookFromList(bookDetail.id);
		const toastDelete = document.getElementById('snackbar');
		toastDelete.innerText = 'You just deleted ' + bookDetail.title;		
		toast();
		
	});
	
	actionContainer.append(editButton, deleteButton);	

	return container;

}

function editBook(bookId) {

	const bookTarget = findBook(bookId);
  
    if(bookTarget == null) return;

    bookTarget.title = document.getElementById('editTitle').value;
    bookTarget.author = document.getElementById('editAuthor').value;
    bookTarget.year = document.getElementById('editYear').value;

    document.dispatchEvent(new Event(RENDER_EVENT));

    // untuk fungsi save ke local storage
    saveData();

    const editedToast = document.getElementById('snackbar');
		editedToast.innerText =  'You just edited the book';
		toast();
}

function finishedReading (bookId) {
	const bookTarget = findBook(bookId);

	if (bookTarget == null) return;

	bookTarget.isFinished = true;
	document.dispatchEvent(new Event(RENDER_EVENT));

	// untuk fungsi save ke local storage
	saveData();
}

function findBook(bookId) {
	for (const bookItem of bookShelf) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}

	return null;
}

function deleteBookFromList(bookId) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	bookShelf.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));

	// untuk fungsi save ke local storage
	saveData();
}
function unfinishedReading(bookId) {
	const bookTarget = findBook(bookId);

	if (bookTarget == null) return;

	bookTarget.isFinished = false;
	document.dispatchEvent(new Event(RENDER_EVENT));

	// untuk fungsi save ke local storage
	saveData();
}
function findBookIndex(bookId) {
	for (const index in bookShelf) {
		if (bookShelf[index].id === bookId) {
			return index;
		}
	}

	return -1
}

function toast() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function clearToast() {
	const toastEmpty = document.getElementById('snackbar');
	toastEmpty.innerText = ''; 
}

function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(bookShelf);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));

	}
}

function isStorageExist() {
	if (typeof (storage) === undefined) {
		alert('Browser kamu tidak mendukung local storage');
		return false;
	}

	return true;
}

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const book of data) {
			bookShelf.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}