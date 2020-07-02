$(document).ready(function(){
    firebase.initializeApp({
        apiKey: "AIzaSyAjNcEM7My4wFxCHb2wMlu6TuGzr9r8wIY",
        authDomain: "mcdonald-swebdesign.firebaseapp.com",
        databaseURL: "https://mcdonald-swebdesign.firebaseio.com",
        projectId: "mcdonald-swebdesign",
        storageBucket: "mcdonald-swebdesign.appspot.com",
        messagingSenderId: "901465096290",
        appId: "1:901465096290:web:98ef9b152715b90a8a913b",
        measurementId: "G-2JD346FW7Z"
    });

    // Reference chatroom document
  const docRef = firebase.firestore()
  .collection("chatrooms")
  .doc("chatroom1");
// Reference chatroom messages
const messagesRef = docRef.collection("messages");

// Referenct authentifacation
const auth = firebase.auth();

// Reference chatroom messages query
const queryRef = messagesRef
  .orderBy("timeStamp", "asc");

// Store Profile Info
let profile_Name;

// REGISTER DOM ELEMENTS
const $email = $('#email');
const $password = $('#password');
const $btnSignIn = $('#btnSignIn');
const $btnSignUp = $('#btnSignUp');
const $btnSignOut = $('#btnSignOut');
const $signInfo = $('#sign-info');
const $cardHeader = $('#card-header');
const $messageField = $('#message-field');
const $messageList = $('#message-list');
const $userName = $('#user-name');
$signInfo.html("");

// SignIn
$btnSignIn.click(function (e) {
  $btnSignIn.html(`<span class="spinner-border spinner-border-sm"></span>`);
  auth.signInWithEmailAndPassword($email.val(), $password.val())
    .then(function (e) {
      $btnSignIn.html(`Sign In`);
      window.location.href = "./chat.html";
    })
    .catch(function (e) {
      $btnSignIn.html(`Sign In`);
      console.log(e.message);
      $signInfo.html(e.message);
    });
});

// SignUp
$btnSignUp.click(function (e) {
  console.log('sign up now ...');
  $btnSignUp.html(`<span class="spinner-border spinner-border-sm"></span>`);
  auth.createUserWithEmailAndPassword($email.val(), $password.val())
    .then(function () {
      const user = auth.currentUser;
      profile_Name = $('#userName').val();
      console.log(user);

      user.updateProfile({
        displayName: profile_Name,
      })
        .then(function () {
          $btnSignUp.html(`Sign Up`);
          $email.val('');
          $password.val('');
          $('#userName').val('');
          console.log("Update successful.");
          window.location.href = "./chat.html";
        });
    })
    .catch(function (e) {
      console.log(e.message);
      $signInfo.html(e.message);
    });
});

// Listening Login User
auth.onAuthStateChanged(function (user) {
  if (user) {
    console.log(user);
    $signInfo.html(`${user.email} 已經登入!`);
    user.providerData.forEach(function (profile) {
      profile_Name = profile.displayName;
      $userName.html(profile.displayName);
    });
  } else {
    console.log("沒有任何人登入!");
  }
});


// Signout
$btnSignOut.click(function () {
  auth.signOut();
  $email.val('');
  $password.val('');
  $signInfo.html('沒有任何人登入!');
  window.location.href = "./contact.html";
});

// SET CHAT ROOM TITLE
docRef.get().then(function (doc) {
  $cardHeader.html(doc.data().name);
});

// LISTEN FOR KEYPRESS EVENT
$messageField.keypress(function (e) {
  if (e.keyCode == 13) {
    //FIELD VALUES
    let message = $messageField.val();

    //SAVE DATA TO FIREBASE
    messagesRef.add({
      "senderName": profile_Name,
      "message": message,
      "timeStamp": Date.now()
    });

    // EMPTY INPUT FIELD
    $messageField.val('');
  }
});

// A RENDER SCREEN CALLBACK THAT IS TRIGGERED FOR EACH CHAT MESSAGE
queryRef.onSnapshot(function (querySnapshot) {
  $messageList.html('');
  //MONITOR CHAT MESSAGE AND RENDER SCREEN
  querySnapshot.forEach(function (doc) {
    let senderName = doc.data().senderName || "anonymous";
    let message = doc.data().message;
    let messageItem = `
      <li class="message-item">
        <strong class="chat-username">${senderName}:</strong>
        ${message}
      </li>
      `;
    $messageList.append(messageItem);
  });
  if ($messageList[0]) {
    //SCROLL TO BOTTOM OF MESSAGE LIST
    $messageList[0].scrollTop = $messageList[0].scrollHeight;

  }
});
});