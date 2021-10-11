locals {
  bucket = "jai.vin"
  region = "sfo3"
}

/*
  Setup the website foundation.
*/

// Create the bucket
resource "digitalocean_spaces_bucket" "site_bucket" {
  name   = local.bucket
  region = local.region
}

// Add the files
resource "digitalocean_spaces_bucket_object" "site" {
  bucket       = local.bucket
  region       = local.region
  acl          = "public-read"
  key          = "index.html"
  content      = "<html><body>jai.vin</body></html>"
  content_type = "text/html"
}

/*
  Setup the website DNS records.
*/

// Create the record for the root
resource "cloudflare_record" "site_dns" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = "@"
  type    = "CNAME"
  value   = "${local.bucket}.${local.region}.digitaloceanspaces.com"
}

// Create a redirect record for www
resource "cloudflare_record" "www_dns" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = "www"
  type    = "CNAME"
  value   = "@"
}
