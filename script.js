// নিচের কনফিগারেশন অংশে আপনার Firebase প্রজেক্টের ইনফো বসাতে হবে
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Firebase শুরু করা
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// ফাইল আপলোড ফাংশন
function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert("ফাইল বাছাই করুন");

  const ref = storage.ref('uploads/' + file.name);
  ref.put(file).then(() => {
    alert("✅ আপলোড সফল");
    loadFiles();
  });
}

// সব ফাইল লোড করে দেখানো
function loadFiles() {
  const listDiv = document.getElementById('fileList');
  listDiv.innerHTML = "Loading...";
  const ref = storage.ref('uploads');

  ref.listAll().then(res => {
    listDiv.innerHTML = '';
    res.items.forEach(itemRef => {
      itemRef.getDownloadURL().then(url => {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.innerHTML = `
          📄 <a href="${url}" target="_blank">${itemRef.name}</a>
          <button onclick="downloadFile('${itemRef.fullPath}')">⬇️</button>
          <button onclick="deleteFile('${itemRef.fullPath}')">🗑️</button>
        `;
        listDiv.appendChild(div);
      });
    });
  });
}

// ডাউনলোড ফাংশন
function downloadFile(path) {
  storage.ref(path).getDownloadURL().then(url => {
    window.open(url, '_blank');
  });
}

// ডিলিট ফাংশন
function deleteFile(path) {
  if (confirm("ফাইলটি ডিলিট করবেন?")) {
    storage.ref(path).delete().then(() => {
      alert("🗑️ ফাইল ডিলিট হয়েছে");
      loadFiles();
    });
  }
}

// পেজ লোডে ফাইল লোড
window.onload = loadFiles;
