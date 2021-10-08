// Setup the state management
terraform {
  backend "s3" {
    bucket = "waifudex-terraform-state"
    key    = "state/"
    region = "us-west-1"
  }
}

// Initialize the providers
provider "aws" {
  region = var.aws_region
}
provider "cloudflare" {}

// Get the cloudflare zone
data "cloudflare_zones" "domain" {
  filter {
    name = var.domain
  }
}
