const jobs = document.querySelector("#jobs");
const filterJobs = document.querySelector("#filterJobs");
const filterClear = document.querySelector("#filterClear");
const filter = document.querySelector("#filter");

let arrayWithJobs = [];

async function fetchJobs() {
  try {
    const result = await fetch("./data.json");
    arrayWithJobs = await result.json();
    displayJobs(arrayWithJobs);
  } catch (error) {
    console.error(error);
  }
}

fetchJobs();

function createElement(tagName, classNames = [], id = "", textContent = "", imgSrc = "", altImg = "") {
  const element = document.createElement(tagName);
  if (classNames.length > 0) {
    element.classList.add(...classNames);
  }
  if (id !== "") {
    element.id = id;
  }
  if (textContent !== "") {
    element.textContent = textContent;
  }
  if (tagName == "img") {
    element.src = imgSrc;
    element.alt = altImg;
  }
  return element;
}

function createTagElement(parent, tagName, classNames = [], id = "", textContent = "", imgSrc = "", altImg = "") {
  const tagElement = createElement(tagName, classNames, id, textContent, imgSrc, altImg);
  parent.appendChild(tagElement);
  return tagElement;
}

function displayJobs(arrayJobList) {
  jobs.innerHTML = "";
  arrayJobList.forEach((element) => {
    const jobsContainer = createTagElement(jobs, "div", ["jobs__container"]);
    const jobsLeft = createTagElement(jobsContainer, "div", ["jobs__left"]);
    checkFeatured(element.featured, jobsLeft);

    const jobsBox = createTagElement(jobsContainer, "div", ["jobs__box"]);
    const jobsSection = createTagElement(jobsBox, "div", ["jobs__section"]);
    const jobsLogo = createTagElement(jobsSection, "img", ["jobs__logo"], "", "", element.logo, element.company);
    const jobsDetails = createTagElement(jobsSection, "div", ["jobs__details"]);
    const jobsFeatures = createTagElement(jobsDetails, "div", ["jobs__features"]);
    const jobsCompany = createTagElement(jobsFeatures, "span", ["jobs__company"], "", element.company);
    const jobsNewClasses = element.new ? ["jobs__new"] : ["jobs__new", "hide"];
    const jobsNew = createTagElement(jobsFeatures, "span", jobsNewClasses, "", "NEW!");
    const jobsFeaturedClasses = element.featured ? ["jobs__featured"] : ["jobs__featured", "hide"];
    const jobsFeatured = createTagElement(jobsFeatures, "span", jobsFeaturedClasses, "", "FEATURED");
    const jobsPosition = createTagElement(jobsDetails, "h1", ["jobs__position"], "", element.position);
    const jobsInfos = createTagElement(jobsDetails, "div", ["jobs__infos"]);

    createTagElement(jobsInfos, "span", ["jobs__info"], "", element.postedAt);
    createTagElement(jobsInfos, "span", ["jobs__separator"]);
    createTagElement(jobsInfos, "span", ["jobs__info"], "", element.contract);
    createTagElement(jobsInfos, "span", ["jobs__separator"]);
    createTagElement(jobsInfos, "span", ["jobs__info"], "", element.location);

    const jobsCategories = createTagElement(jobsBox, "div", ["jobs__categories"]);

    let arrayTools = [element.role, element.level, ...element.tools];
    displayTools(arrayTools, jobsCategories, arrayJobList);
  });
}

function displayTools(toolsArray = [], tagParent, array) {
  toolsArray.forEach((item) => {
    const jobsCategoryTools = createTagElement(tagParent, "div", ["jobs__category"], "", item);
    selectTag(jobsCategoryTools, array);
  });
}

function displayFilterTag(tag, array) {
  const arrayFiltered = array.filter(
    (item) =>
      item.role === tag.innerText || item.level === tag.innerText || item.tools.some((element) => element === tag.innerText)
  );
  displayJobs(arrayFiltered);
}

function displayRemoveFilterTag() {
  const tagSelected = document.querySelectorAll("#filterJob");
  const tagSelectedArray = Array.from(tagSelected);
  const arrayFiltered = arrayWithJobs.filter((item) =>
    tagSelectedArray.every(
      (element) =>
        item.role === element.innerText || item.level === element.innerText || item.tools.some((el) => el === element.innerText)
    )
  );
  displayJobs(arrayFiltered);
}

function selectTag(tag, array) {
  tag.addEventListener("click", () => {
    const filterTag = document.querySelectorAll("#filterJob");
    const filterTagArray = Array.from(filterTag);
    const exist = filterTagArray.some((item) => item.innerText === tag.innerText);
    filter.classList.remove("hide");
    if (!exist) {
      const filterJob = document.createElement("div");
      const filterTitle = document.createElement("div");
      const filterClose = document.createElement("div");
      const filterImgClose = document.createElement("img");
      filterImgClose.src = "./images/icon-remove.svg";
      filterImgClose.alt = "Close";
      filterClose.classList.add("filter__close");
      filterClose.id = "filterClose";
      filterTitle.classList.add("filter__title");
      filterTitle.innerText = tag.innerText;
      filterJob.classList.add("filter__job");
      filterJob.id = "filterJob";
      filterClose.appendChild(filterImgClose);
      filterJob.append(filterTitle, filterClose);
      filterJobs.appendChild(filterJob);

      filterJob.addEventListener("click", () => {
        filterJobs.removeChild(filterJob);
        displayRemoveFilterTag();
      });
    }
    displayFilterTag(tag, array);
  });
}

function checkFeatured(item, tag) {
  if (item) tag.classList.add("featured");
}

filterClear.addEventListener("click", () => {
  filterJobs.innerHTML = "";
  displayJobs(arrayWithJobs);
});
