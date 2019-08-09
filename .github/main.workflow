workflow "Deploy on Now" {
  on = "push"
  resolves = ["alias"]
}

action "branch_filter" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "deploy" {
  needs = "branch_filter"
  uses = "actions/zeit-now@master"
  secrets = [
    "ZEIT_TOKEN",
  ]
}

action "alias" {
  needs = "deploy"
  uses = "actions/zeit-now@master"
  args = "alias"
  secrets = [
    "ZEIT_TOKEN",
  ]
}
