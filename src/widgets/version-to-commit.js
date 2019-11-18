window.addEventListener('load', () => {
  const versionAndCommitButton = document.querySelector(
    '.navbar-brand .version'
  );

  const version = versionAndCommitButton.dataset.ver;
  const commitID = versionAndCommitButton.dataset.commit;

  if (!version || !commitID || !versionAndCommitButton) {
    return;
  }

  versionAndCommitButton.addEventListener('click', function() {
    if (versionAndCommitButton.textContent === version) {
      versionAndCommitButton.textContent = commitID.slice(0, 7);
    } else {
      versionAndCommitButton.textContent = version;
    }
  });
});
