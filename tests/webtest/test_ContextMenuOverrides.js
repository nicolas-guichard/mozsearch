"use strict";

add_task(async function test_SingleOverride() {
  const path = "/tests/source/overs.cpp";
  await TestUtils.loadPath(path);

  const singlePure = frame.contentDocument.querySelector('span[data-symbols="_ZN10SingleBase10singlePureEv"]');
  ok(!!singlePure, "SingleBase::singlePure token exists");

  TestUtils.click(singlePure);

  const menu = frame.contentDocument.querySelector("#context-menu");
  await waitForShown(menu, "Context menu is shown for symbol click");

  const overrideRows = menu.querySelectorAll(".icon-export-alt");
  is(overrideRows.length, 1, "Menu has 1 override row");
  is(overrideRows[0].textContent, "Go to definition of Sole Override SingleSub::singlePure");
});

add_task(async function test_TwoOverrides() {
  const path = "/tests/source/overs.cpp";
  await TestUtils.loadPath(path);

  const doublePure = frame.contentDocument.querySelector('span[data-symbols="_ZN10DoubleBase10doublePureEv"]');
  ok(!!doublePure, "DoubleBase::doublePure token exists");

  TestUtils.click(doublePure);

  const menu = frame.contentDocument.querySelector("#context-menu");
  await waitForShown(menu, "Context menu is shown for symbol click");

  const overrideRows = menu.querySelectorAll(".icon-export-alt");
  is(overrideRows.length, 1, "Menu has 1 override row");
  ok(overrideRows[0].classList.contains("submenu-label"), "The override row is a submenu");
  is(overrideRows[0].textContent, "2 Overrides");

  TestUtils.dispatchMouseEvent("mouseenter", overrideRows[0]);

  await TestUtils.waitForCondition(() => frame.contentDocument.querySelector(".context-submenu"), "Submenu is eventually created on mouseenter");
  const submenu = frame.contentDocument.querySelector(".context-submenu");
  await waitForShown(submenu, "Submenu is eventually shown on mouseenter");

  const directJumps = submenu.querySelectorAll('a[href*="/tests/source/overs.cpp#"]');
  is(directJumps.length, 2, "2 overrides with direct jump to definition are shown");
});

add_task(async function test_TwentyOverrides() {
  const path = "/tests/source/overs.cpp";
  await TestUtils.loadPath(path);

  const twentyPure = frame.contentDocument.querySelector('span[data-symbols="_ZN10TwentyBase10twentyPureEv"]');
  ok(!!twentyPure, "TwentyBase::twentyPure token exists");

  TestUtils.click(twentyPure);

  const menu = frame.contentDocument.querySelector("#context-menu");
  await waitForShown(menu, "Context menu is shown for symbol click");

  const overrideRows = menu.querySelectorAll(".icon-export-alt");
  is(overrideRows.length, 1, "Menu has 1 override row");
  ok(overrideRows[0].classList.contains("submenu-label"), "The override row is a submenu");
  is(overrideRows[0].textContent, "20 Overrides");

  TestUtils.dispatchMouseEvent("mouseenter", overrideRows[0]);

  await TestUtils.waitForCondition(() => frame.contentDocument.querySelector(".context-submenu"), "Submenu is eventually created on mouseenter");
  const submenu = frame.contentDocument.querySelector(".context-submenu");
  await waitForShown(submenu, "Submenu is eventually shown on mouseenter");

  const directJumps = submenu.querySelectorAll('a[href*="/tests/source/overs.cpp#"]');
  is(directJumps.length, 6, "6 overrides with direct jump to definition are shown");

  const searches = submenu.querySelectorAll('a[href*="/tests/search"]');
  is(searches.length, 5, "5 searches shown");

  const searchMore = searches[0];
  is(searchMore, submenu.querySelector('a'), "Own search link is the first row");
  is(searchMore.textContent, "Show all (10 out of 20 listed below)");
});
