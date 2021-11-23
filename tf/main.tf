// Setup the state management
terraform {
  backend "s3" {
    bucket = "waifudex-terraform"
    key    = "jai.vin/terraform.tfstate"
    region = "us-east-1"
  }
  // Define the providers
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }
}

// Initialize the providers
provider "aws" {
  region = var.aws_region
}
provider "cloudflare" {}

// Initialize the modules
module "src_dir" {
  source  = "hashicorp/dir/template"
  version = "1.0.2"

  base_dir = "${path.module}/../build"
}

// Get the cloudflare zone
data "cloudflare_zones" "domain" {
  filter {
    name = var.domain
  }
}
