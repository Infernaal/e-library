document.addEventListener('DOMContentLoaded', function() {
    var exitElement = document.querySelector('.nav-option.logout');
    if (exitElement) {
        exitElement.addEventListener('click', function() {
            window.location.href = '/login';
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
  const loadBooksDiv = document.getElementById('load-books');
  const loadingIndicator = document.getElementById('loading-indicator');
  const messageBox = document.getElementById('message-box');
  const messageText = document.getElementById('message-text');

  loadBooksDiv.addEventListener('click', () => {
    loadingIndicator.style.display = 'flex';

    fetch('/admin/load', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      loadingIndicator.style.display = 'none';
      
      messageText.textContent = data.message;
      messageBox.style.display = 'block';

      setTimeout(() => {
        messageBox.style.display = 'none';
      }, 3000);
    })
    .catch(error => {
      loadingIndicator.style.display = 'none';

      console.error('Error:', error);
      messageText.textContent = 'Помилка при завантаженні книг';
      messageBox.style.display = 'block';

      setTimeout(() => {
        messageBox.style.display = 'none';
      }, 3000);
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-form');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;
    const published_year = document.getElementById('published-year').value;
    const image = document.getElementById('image').value;
    const download_url = document.getElementById('download-url').value;
    const messageBox = document.getElementById('add-message-box');
    const messageText = document.getElementById('add-message-text');

    fetch('/admin/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, description, published_year, image, download_url })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error executing the request');
      }
      return response.json();
    })
    .then(data => {
        
        messageText.textContent = data.message || 'The book has been successfully added to the site list!';
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        messageText.textContent = 'Error adding the book to the list';
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('edit-form');

  editForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const id = document.getElementById('edit-id').value;
      const title = document.getElementById('edit-title').value;
      const author = document.getElementById('edit-author').value;
      const published_year = document.getElementById('edit-published-year').value;
      const description = document.getElementById('edit-description').value;
      const image = document.getElementById('edit-image').value;
      const download_url = document.getElementById('download-url').value;

      const messageBox = document.getElementById('edit-message-box');
      const messageText = document.getElementById('edit-message-text');

      let updatedFields = {};

      if (title) updatedFields.title = title;
      if (author) updatedFields.author = author;
      if (published_year) updatedFields.published_year = published_year;
      if (description) updatedFields.description = description;
      if (image) updatedFields.image = image;
      if (download_url) updatedFields.download_url = download_url;

      if (Object.keys(updatedFields).length === 0) {
          messageText.textContent = 'Please fill in at least one field to update.';
          messageBox.style.display = 'block';
          setTimeout(() => {
              messageBox.style.display = 'none';
          }, 3000);
          return;
      }

      fetch(`/admin/edit/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error executing request');
          }
          return response.json();
      })
      .then(data => {
          messageText.textContent = data.message || 'Book successfully updated!';
          messageBox.style.display = 'block';
          setTimeout(() => {
              messageBox.style.display = 'none';
          }, 3000);
          editForm.reset();
      })
      .catch(error => {
          console.error('Error:', error);
          messageText.textContent = 'Error updating the book.';
          messageBox.style.display = 'block';
          setTimeout(() => {
              messageBox.style.display = 'none';
          }, 3000);
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const deleteForm = document.getElementById('delete-form');
  const deleteMessageBox = document.getElementById('delete-message-box');
  const deleteMessageText = document.getElementById('delete-message-text');

  deleteForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const id = document.getElementById('delete-id').value;

      if (!id) {
          deleteMessageText.textContent = 'Please enter a valid book ID to delete.';
          deleteMessageBox.style.display = 'block';
          setTimeout(() => {
              deleteMessageBox.style.display = 'none';
          }, 3000);
          return;
      }

      fetch(`/admin/delete/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error executing delete request');
          }
          return response.json();
      })
      .then(data => {
          deleteMessageText.textContent = data.message || 'Book successfully deleted!';
          deleteMessageBox.style.display = 'block';
          setTimeout(() => {
              deleteMessageBox.style.display = 'none';
          }, 3000);
          deleteForm.reset();
      })
      .catch(error => {
          console.error('Error:', error);
          deleteMessageText.textContent = 'Error deleting the book.';
          deleteMessageBox.style.display = 'block';
          setTimeout(() => {
              deleteMessageBox.style.display = 'none';
          }, 3000);
      });
  });
});

document.addEventListener('DOMContentLoaded', () => { 
  const form = document.getElementById('view-form'); 

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const id = document.getElementById('view-id').value; 
    const messageBox = document.getElementById('add-message-box');
    const messageText = document.getElementById('add-message-text');

    // Добавляем кнопку закрытия
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'close-button'; 

    // Обработчик для закрытия сообщения
    closeButton.addEventListener('click', () => {
      messageBox.style.display = 'none';
    });

    fetch(`/admin/view/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error executing request');
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        messageText.innerHTML = `
          <strong>----FOUND BOOK----</strong><br>
          <strong>Author:</strong> ${data.author}<br>
          <strong>Title:</strong> ${data.title}<br>
          <strong>Description:</strong> ${data.description}<br>
          <strong>Published Year:</strong> ${data.published_year}<br>
          <div class="button-container"></div> <!-- Контейнер для кнопки -->
        `;
      } else {
        messageText.textContent = 'Book not found.';
      }
      messageText.querySelector('.button-container').appendChild(closeButton);
      messageBox.style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
      messageText.textContent = 'Error fetching book details.';
      messageText.querySelector('.button-container').appendChild(closeButton);
      messageBox.style.display = 'block';
    });
  });
});