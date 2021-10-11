// Setup the state management
terraform {
  backend "s3" {
    bucket = "waifudex-terraform"
    key    = "jai.vin/terraform.tfstate"
    region = "us-east-1"
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

// Initialize the providers
provider "aws" {
  region  = var.aws_region
  version = "~> 3.0"
}
provider "cloudflare" {}
provider "digitalocean" {}

// Get the cloudflare zone
data "cloudflare_zones" "domain" {
  filter {
    name = var.domain
  }
}
