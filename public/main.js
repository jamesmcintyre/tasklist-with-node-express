'use strict';

$(document).ready(init);

function init() {
  populateTasks();
  $('#addTask').click(addTask);
  $(document).on('click', '#done', taskDone);
  $(document).on('click', '.dispdel', taskDelete);
}


function addTask() {
  event.preventDefault();
  console.log('add task called');
  var newTaskName = $('#taskName').val();
  var newTaskDue = $('#duedate').val();
  console.log(newTaskName+' '+newTaskDue);
  $('#taskName').val('');
  $('#duedate').val('');
  $.post('/task', {
    taskname: newTaskName,
    duedate: newTaskDue
  })
  .success(function(data) {
    populateTasks();
    // var $newDisplayName = $('<td>').addClass('disptaskname col-xs-7').text(newTaskName);
    // var $newDisplayDate = $('<td>').addClass('disptaskdue col-xs-3').text(newTaskDue);
    // var $newTaskStatus = $('<td>').addClass('dispstatus col-xs-1').append($('<input>').attr({type: 'checkbox', id: 'done'}));
    // var $newDeleteTask = $('<td>').addClass('dispdel col-xs-1').append('<p>Delete</p>');
    // $('.list').append($('<tr>').addClass('listitem .col-xs-12').append([$newDisplayName, $newDisplayDate, $newTaskStatus, $newDeleteTask]));
    // $('#done').on('click', taskDone);
    // $('.dispdel').on('click', taskDelete);
  })
  .fail(function(err) {
    alert('something went wrong :(')
  });
}



function populateTasks() {
  console.log('populating task list');
  $.get('/tasks', function(data) {
    var $tasks = data.map(function(task) {
      var newTaskName = task.taskname;
      var newTaskDueDate = task.duedate;
      var newTaskStatus = task.status;
      var $newDisplayName = $('<td>').addClass('disptaskname col-xs-7').text(newTaskName);
      var $newDisplayDate = $('<td>').addClass('disptaskdue col-xs-3').text(newTaskDueDate);
      var $newCheckbox = $('<input>').attr({'type': 'checkbox', 'id': 'done'});
      if (newTaskStatus === true){
        console.log('true is true');
        $newCheckbox.prop('checked', true);
      }
      var $newTaskStatus = $('<td>').addClass('dispstatus col-xs-1').append($newCheckbox);
      var $newDeleteTask = $('<td>').addClass('dispdel col-xs-1').append('<p>Delete</p>');
      var $newListItem = $('<tr>').addClass('listitem col-xs-12').append([$newDisplayName, $newDisplayDate, $newTaskStatus, $newDeleteTask]);
      if (newTaskStatus === true){
        console.log('adding class');
        $newListItem.addClass('success complete');
      }
      return $newListItem;
    });
    $('#list').empty().append($tasks);
  });
}



function taskDone(){
  var taskIndex = $(this).closest('tr').index();
  $.post('/task/done', {
    changestatus: taskIndex
  })
  .success(function(data) {
    populateTasks();
  })
  .fail(function(err) {
    alert('something went wrong :(')
  });
}



function taskDelete(){
  var taskIndex = $(this).closest('tr').index();
  $.post('/task/delete', {
    delete: taskIndex
  })
  .success(function(data) {
    populateTasks();
  })
  .fail(function(err) {
    alert('something went wrong :(')
  });
}
