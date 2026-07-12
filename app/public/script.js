const message = {
  firstName: 'Adam',
  age: 19,
  jobTitle: 'Student',
  Greeting() {
    console.log('Hello and welcome to my app! You can find out information about this app by going to the "About" section.');
  }
};

message.Greeting();

$('.ui.rating').rating({
  onRate: function(value) {
    
    $('#ratingValue').val(value);
  }
});

$('.ui.dropdown').dropdown({
  keepOnScreen: true
});

