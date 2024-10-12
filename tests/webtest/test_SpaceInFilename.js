add_task(async function test_SpaceInFilename() {
  await TestUtils.loadPath("/");
  TestUtils.shortenSearchTimeouts();

  const query = frame.contentDocument.querySelector("#query");
  TestUtils.setText(query, "SymbolInFilenameWithSpace");

  const content = frame.contentDocument.querySelector("#content");

  await waitForCondition(
    () => content.textContent.includes("Core code (1 lines") &&
      content.textContent.includes("Definitions (SymbolInFilenameWithSpace) (1 lines") &&
      content.textContent.includes("var SymbolInFilenameWithSpace"),
    "symbol in file with space in filename matches as definition");

  const links = frame.contentDocument.querySelectorAll(".result-head a");
  is(links.length, 2);
  is(links[1].getAttribute("href"), "/tests/source/js/with%20space.js",
     "The space in the href should be escaped");
});
