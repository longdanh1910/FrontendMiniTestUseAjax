$(document).ready(function() {
    // Load danh sách classes khi trang được tải
    loadClasses();

    // Form thêm hoặc cập nhật Class
    $('#class-form').on('submit', function(event) {
        event.preventDefault();
        const id = $('#class-id').val();
        const name = $('#class-name').val();

        if (id) {
            updateClass(id, name);
        } else {
            addClass(name);
        }
    });
});

// Load danh sách classes từ API
function loadClasses() {
    $.ajax({
        url: 'http://localhost:8080/api/studentclass',
        type: 'GET',
        success: function(classes) {
            let classBody = $('#class-body');
            classBody.empty();

            $.each(classes, function(i, studentClass) {
                classBody.append(`
                    <tr>
                        <td>${studentClass.id}</td>
                        <td>${studentClass.name}</td>
                        <td>
                            <button onclick="editClass(${studentClass.id})">Edit</button>
                            <button onclick="deleteClass(${studentClass.id})">Delete</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function() {
            alert('Unable to load classes');
        }
    });
}

// Thêm mới Class
function addClass(name) {
    const classData = { name: name };

    $.ajax({
        url: 'http://localhost:8080/api/studentclass',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(classData),
        success: function() {
            alert('Class added successfully');
            loadClasses();
            clearClassForm();
        },
        error: function() {
            alert('Error adding class');
        }
    });
}

// Cập nhật Class
function updateClass(id, name) {
    const classData = { id: id, name: name };

    $.ajax({
        url: `http://localhost:8080/api/studentclass/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(classData),
        success: function() {
            alert('Class updated successfully');
            loadClasses();
            clearClassForm();
        },
        error: function() {
            alert('Error updating class');
        }
    });
}

// Xóa Class
function deleteClass(id) {
    $.ajax({
        url: `http://localhost:8080/api/studentclass/${id}`,
        type: 'DELETE',
        success: function() {
            alert('Class deleted successfully');
            loadClasses();
        },
        error: function() {
            alert('Error deleting class');
        }
    });
}

// Lấy thông tin Class để cập nhật
function editClass(id) {
    $.ajax({
        url: `http://localhost:8080/api/studentclass/${id}`,
        type: 'GET',
        success: function(studentClass) {
            $('#class-id').val(studentClass.id);
            $('#class-name').val(studentClass.name);
            $('#class-submit-button').text('Update Class');
        },
        error: function() {
            alert('Error loading class data');
        }
    });
}

// Xóa thông tin form sau khi thêm hoặc cập nhật
function clearClassForm() {
    $('#class-id').val('');
    $('#class-name').val('');
    $('#class-submit-button').text('Add Class');
}
