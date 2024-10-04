$(document).ready(function() {
    // Load danh sách classes và students khi trang được tải
    loadClasses();
    loadStudents();

    // Form thêm hoặc cập nhật Student
    $('#student-form').on('submit', function(event) {
        event.preventDefault();
        const id = $('#student-id').val();
        const firstName = $('#first-name').val();
        const lastName = $('#last-name').val();
        const dob = $('#dob').val();
        const address = $('#address').val();
        const mark = $('#mark').val();
        const classId = $('#student-class').val();

        if (id) {
            updateStudent(id, firstName, lastName, dob, address, mark, classId);
        } else {
            addStudent(firstName, lastName, dob, address, mark, classId);
        }
    });
});

// Load danh sách class từ API
function loadClasses() {
    $.ajax({
        url: 'http://localhost:8080/api/studentclass',
        type: 'GET',
        success: function(classes) {
            let classSelect = $('#student-class');
            classSelect.empty();
            classSelect.append('<option value="">Select a class</option>');

            $.each(classes, function(i, studentClass) {
                classSelect.append(`<option value="${studentClass.id}">${studentClass.name}</option>`);
            });
        },
        error: function() {
            alert('Unable to load classes');
        }
    });
}

// Load danh sách students từ API
function loadStudents() {
    $.ajax({
        url: 'http://localhost:8080/api/students',
        type: 'GET',
        success: function(students) {
            let studentBody = $('#student-body');
            studentBody.empty();

            $.each(students, function(i, student) {
                studentBody.append(`
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.firstName}</td>
                        <td>${student.lastName}</td>
                        <td>${student.dob}</td>
                        <td>${student.address}</td>
                        <td>${student.mark}</td>
                        <td>${student.studentClass.name}</td>
                        <td>
                            <button onclick="editStudent(${student.id})">Edit</button>
                            <button onclick="deleteStudent(${student.id})">Delete</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function() {
            alert('Unable to load students');
        }
    });
}

// Thêm mới Student
function addStudent(firstName, lastName, dob, address, mark, classId) {
    const studentData = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        address: address,
        mark: mark,
        studentClass: {
            id: classId
        }
    };

    $.ajax({
        url: 'http://localhost:8080/api/students',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(studentData),
        success: function() {
            alert('Student added successfully');
            loadStudents();
            clearStudentForm();
        },
        error: function() {
            alert('Error adding student');
        }
    });
}

// Cập nhật Student
function updateStudent(id, firstName, lastName, dob, address, mark, classId) {
    const studentData = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        address: address,
        mark: mark,
        studentClass: {
            id: classId
        }
    };

    $.ajax({
        url: `http://localhost:8080/api/students/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(studentData),
        success: function() {
            alert('Student updated successfully');
            loadStudents();
            clearStudentForm();
        },
        error: function() {
            alert('Error updating student');
        }
    });
}

// Xóa Student
function deleteStudent(id) {
    $.ajax({
        url: `http://localhost:8080/api/students/${id}`,
        type: 'DELETE',
        success: function() {
            alert('Student deleted successfully');
            loadStudents();
        },
        error: function() {
            alert('Error deleting student');
        }
    });
}

// Lấy thông tin Student để cập nhật
function editStudent(id) {
    $.ajax({
        url: `http://localhost:8080/api/students/${id}`,
        type: 'GET',
        success: function(student) {
            $('#student-id').val(student.id);
            $('#first-name').val(student.firstName);
            $('#last-name').val(student.lastName);
            $('#dob').val(student.dob);
            $('#address').val(student.address);
            $('#mark').val(student.mark);
            $('#student-class').val(student.studentClass.id);
            $('#student-submit-button').text('Update Student');
        },
        error: function() {
            alert('Error loading student data');
        }
    });
}

// Xóa thông tin form sau khi thêm hoặc cập nhật
function clearStudentForm() {
    $('#student-id').val('');
    $('#first-name').val('');
    $('#last-name').val('');
    $('#dob').val('');
    $('#address').val('');
    $('#mark').val('');
    $('#student-class').val('');
    $('#student-submit-button').text('Add Student');
}
