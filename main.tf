// Setup the state management
terraform {
  backend "s3" {
    bucket = "waifudex-terraform"
    key    = "state/terraform.tfstate"
    region = "us-east-1"
  }
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
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
