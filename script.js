const jobs = document.querySelector("#jobs");
const filterJobs = document.querySelector("#filterJobs");
const filterClear = document.querySelector("#filterClear");
const filter = document.querySelector("#filter");

let arrayWithJobs = [];
async function fetchJobs() {
  try {
    const result = await fetch("./data.json");
    const jobList = await result.json();
    arrayWithJobs = jobList;
    displayJobs(jobList);
  } catch (error) {
    console.error(error);
  }
}

fetchJobs();

function displayJobs(arrayJobList) {
  jobs.innerHTML = "";
  arrayJobList.forEach((element) => {
    const jobsContainer = document.createElement("div");
    const jobsLeft = document.createElement("div");
    const jobsBox = document.createElement("div");
    const jobsSection = document.createElement("div");
    const jobsLogo = document.createElement("img");
    const jobsDetails = document.createElement("div");
    const jobsFeatures = document.createElement("div");
    const jobsCompany = document.createElement("span");
    const jobsNew = document.createElement("span");
    const jobsFeatured = document.createElement("span");
    const jobsPosition = document.createElement("h1");
    const jobsInfos = document.createElement("div");

    const jobsInfoPosted = document.createElement("span");
    const jobsInfoContract = document.createElement("span");
    const jobsInfoLocation = document.createElement("span");
    const jobsSeparator = document.createElement("span");
    const jobsCategories = document.createElement("div");
    const jobsCategoryRole = document.createElement("div");
    const jobsCategoryLevel = document.createElement("div");

    jobsContainer.classList.add("jobs__container");
    jobsLeft.classList.add("jobs__left");
    checkFeatured(element.featured, jobsLeft);

    jobsLogo.classList.add("jobs__logo");
    jobsLogo.src = element.logo;
    jobsLogo.alt = element.company;

    addFeaturedElement(jobsNew, "jobs__new", "jobsNew", "NEW!", element.new);
    addFeaturedElement(jobsFeatured, "jobs__featured", "jobsFeatured", "FEATURED", element.featured);
    addTagElement(jobsCompany, "jobs__company", "jobsCompany", element.company);
    addTagElement(jobsPosition, "jobs__position", "jobsPosition", element.position);
    addTagElement(jobsInfoPosted, "jobs__info", "jobsInfoPosted", element.postedAt);
    addTagElement(jobsInfoContract, "jobs__info", "jobsInfoContract", element.contract);
    addTagElement(jobsInfoLocation, "jobs__info", "jobsInfoLocation", element.location);
    addTagElement(jobsCategoryRole, "jobs__category", "jobsCategoryRole", element.role);
    addTagElement(jobsCategoryLevel, "jobs__category", "jobsCategoryLevel", element.level);

    jobsFeatures.classList.add("jobs__features");
    jobsDetails.classList.add("jobs__details");
    jobsSection.classList.add("jobs__section");
    jobsBox.classList.add("jobs__box");
    jobsInfos.classList.add("jobs__infos");
    jobsCategories.classList.add("jobs__categories");

    jobsFeatures.append(jobsCompany, jobsNew, jobsFeatured);
    jobsInfos.append(jobsInfoPosted, jobsSeparator, jobsInfoContract, jobsSeparator, jobsInfoLocation);
    jobsDetails.append(jobsFeatures, jobsPosition, jobsInfos);
    jobsCategories.append(jobsCategoryRole, jobsCategoryLevel);
    selectTag(jobsCategoryRole, arrayJobList);
    selectTag(jobsCategoryLevel, arrayJobList);
    displayTools(element.tools, jobsCategories, arrayJobList);
    jobsSection.append(jobsLogo, jobsDetails);
    jobsBox.append(jobsSection, jobsCategories);
    jobsContainer.append(jobsLeft, jobsBox);
    jobs.appendChild(jobsContainer, jobsCategories);
  });
}

function displayTools(toolsArray, tagParent, array) {
  toolsArray.forEach((item) => {
    const jobsCategoryTools = document.createElement("div");
    jobsCategoryTools.classList.add("jobs__category");
    jobsCategoryTools.id = "jobsCategoryTools";
    jobsCategoryTools.innerText = item;
    tagParent.appendChild(jobsCategoryTools);
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
function addTagElement(tag, className, idName, textContent) {
  if (textContent) {
    tag.classList.add(className);
    tag.id = idName;
    tag.innerText = textContent;
  }
}
function addFeaturedElement(tag, className, idName, featuredContent, textContent) {
  if (textContent) {
    tag.classList.add(className);
    tag.id = idName;
    tag.innerText = featuredContent;
  }
}

filterClear.addEventListener("click", () => {
  filterJobs.innerHTML = "";
  const jobsContainer = jobs.querySelectorAll("#jobsContainer");
  jobsContainer.forEach((element) => element.classList.remove("hide"));
  displayJobs(arrayWithJobs);
});
