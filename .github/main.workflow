workflow "Deploy to zeit/now" {
  on = "push"
  resolves = ["deploy"]
}

action "branch_filter" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "init" {
  needs = "branch_filter"
  uses = "actions/npm@master"
  args = "install"
}

action "deploy" {
  needs = "init"
  uses = "actions/npm@master"
  args = "run deploy"
}
