// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyB1xgV_uyxBTHgX9Wlvk6pRGNoy2wsjZ20",
  authDomain: "score-ranking-40c95.firebaseapp.com",
  databaseURL: "https://score-ranking-40c95.firebaseio.com",
  projectId: "score-ranking-40c95",
  storageBucket: "score-ranking-40c95.appspot.com",
  messagingSenderId: "289889188041"
});
const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true
})
collection = firestore.collection('score')

collection.orderBy('score', 'desc').onSnapshot(t => {
  const table = document.getElementById('ranking-body')
  table.innerHTML = ''
  t.forEach(r => {
    row = r.data()
    table.insertAdjacentHTML('beforeend', `<tr><td>${row.name}</td><td>${row.score}</td><td>${row.comment}</td></tr>`)
  })
})

document.getElementById('ranking-button').addEventListener('click', () => {
  document.getElementById('ranking-form').style.display = 'none'
  collection.add({
    name: document.getElementById('ranking-name').value,
    score: parseInt(document.getElementById('score-num').innerText),
    comment: document.getElementById('ranking-comment').value,
    version: 1.1
  }).catch(() => {
    alert('古いバージョンかもしれません。リロードしてください。')
  })
})
