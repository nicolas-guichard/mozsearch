function fileURL(path)
{
  return `/mozilla-central/source/${path}`;
}

function getSuffix(filename)
{
  let pos = filename.lastIndexOf(".");
  if (pos == -1) {
    return null;
  }
  return filename.slice(pos + 1).toLowerCase();
}

function chooseIcon(path)
{
  let suffix = getSuffix(path);
  return { 'cpp': 'cpp', 'h': 'h', 'c': 'c', 'js': 'js', 'jsm': 'js', 'py': 'py' }[suffix] || "";
}

function generateBreadcrumbs(path)
{
  if (path == "/") {
    return "";
  }

  let breadcrumbs = "";
  let first = true;
  let pathSoFar = "";
  for (let name of path.split("/")) {
    if (!first) {
      breadcrumbs += `<span class="path-separator">/</span>`;
      pathSoFar += "/" + name;
    } else {
      pathSoFar += name;
    }
    first = false;
    breadcrumbs += `<a href="${fileURL(pathSoFar)}">${name}</a>`;
  }

  return `
  <div class="breadcrumbs">
    ${breadcrumbs}
  </div>
`;
}

function generate(content, opt)
{
  let title = opt.title || "mozsearch";
  let tree = opt.tree || "mozilla-central";
  let shouldAutofocusQuery = opt.shouldAutofocusQuery || false;
  let query = opt.query || "";
  let filters = opt.filters || [];
  let isCaseSensitive = opt.isCaseSensitive === undefined ? true : opt.isCaseSensitive;
  let stateOffset = opt.stateOffset || 0;
  let stateLimit = opt.stateLimit || 100;
  let resultCount = opt.resultCount || 100;
  let eof = opt.eof || false;

  let filterText = "";
  for (let filter of filters) {
    filterText += `
                      <li>
                        <a href="javascript:void(0)" data-value="${filter.name}:">
                          <span class="selector-option-label">
                            ${filter.name}:
                          </span>
                          <span class="selector-option-description">
                            ${filter.description}
                          </span>
                        </a>
                      </li>
`;
  }

  let generatedDate = String(Date());

  let output = `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
  <link href="/static/icons/search.png" rel="shortcut icon">
  <title>${title}</title>

  <link href="/static/css/mozsearch.css" rel="stylesheet" type="text/css" media="screen"/>
  <link href="/static/css/forms.css" rel="stylesheet" type="text/css" media="screen" />
  <link href="/static/css/icons.css" rel="stylesheet" type="text/css" media="screen" />
  <link href="/static/css/selector-common.css" rel="stylesheet" type="text/css" media="screen" />
  <link href="/static/css/filter.css" rel="stylesheet" type="text/css" media="screen" />
  <link href="/static/css/xcode.css" rel="stylesheet" type="text/css" media="screen">
</head>

<body>
  <form method="get" action="/${tree}/search" id="basic_search" class="search-box">
    <fieldset>
        <div id="search-box" class="flex-container" role="group">
            <div class="elem_container find">
                <label for="query" class="query_label visually-hidden">Find</label>
                <input type="text" name="q" ${shouldAutofocusQuery ? "autofocus " : ""} value="${query}" maxlength="2048" id="query" class="query" accesskey="s" title="Search" placeholder="Search ${tree}" autocomplete="off" />
                <div class="zero-size-container">
                  <div class="bubble">
                  </div>
                </div>
                <section id="search-filter" class="search-filter">
                  <button type="button" class="sf-select-trigger" aria-label="Select Filter">
                      <!-- arrow icon using icon font -->
                      <span aria-hidden="true" data-filter-arrow="&#xe801;" class="sf-selector-arrow">
                          Filters
                      </span>
                  </button>
                </section>
                <div class="sf-select-options sf-modal" aria-expanded="false">
                  <ul class="selector-options" tabindex="-1">
                    ${filterText}
                  </ul>
                </div>
            </div>
             <div class="elem_container case">
                <label for="case">
                    <input type="checkbox" name="case" id="case" class="checkbox_case" value="true" accesskey="c" ${isCaseSensitive ? "checked" : ""}/><span class="access-key">C</span>ase-sensitive
                </label>
            </div>
        </div>
    </fieldset>
    <input type="hidden" value="${tree}" id="ts-value" />
    <input type="hidden" name="redirect" value="true" id="redirect" />
    <input type="submit" value="Search" class="visually-hidden" />
  </form>

  <div id="content" class="content" data-no-results="No results for current query.">
    ${content}
  </div>

  <div id="foot" class="footer">
    This page was generated by DXR
    <span class="pretty-date" data-datetime="${generatedDate}"></span>.
  </div>

  <!-- avoid inline JS and use data attributes instead. Hackey but hey... -->
  <span id="data" data-root="/" data-search="/${tree}/search" data-tree="${tree}"></span>
  <span id="state" data-offset="${stateOffset}" data-limit="${stateLimit}" data-result-count="${resultCount}" data-eof="${eof}"></span>

  <script src="/static/js/libs/jquery-2.1.3.min.js"></script>
  <script src="/static/js/libs/nunjucks.min.js"></script>
  <script src="/static/js/utils.js"></script>
  <script src="/static/js/dxr.js"></script>
  <script src="/static/js/context-menu.js"></script>
  <script src="/static/js/filter.js"></script>
  <script src="/static/js/panel.js"></script>
  <script src="/static/js/code-highlighter.js"></script>
</body>
</html>
`;

  return output;
}
