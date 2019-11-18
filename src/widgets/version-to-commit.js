window.addEventListener('load', () => {
  const versionAndCommitButton = document.querySelector(
    '.navbar-brand .version'
  );

  const version = versionAndCommitButton.dataset.ver;
  let commitID = versionAndCommitButton.dataset.commit;

  if (!version || !commitID || !versionAndCommitButton) {
    return;
  }

  commitID = commitID.slice(0, 7);
  versionAndCommitButton.addEventListener('click', function() {
    if (versionAndCommitButton.textContent === version) {
      versionAndCommitButton.textContent = commitID;
    } else {
      versionAndCommitButton.textContent = version;
    }
  });
});
