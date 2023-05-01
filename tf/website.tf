// Setup the S3 bucket.

// Create the bucket
resource "aws_s3_bucket" "site" {
  bucket = var.domain
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

// Create the redirect for www
resource "aws_s3_bucket" "www" {
  bucket = "www.${var.domain}"
  acl    = "private"

  website {
    redirect_all_requests_to = "https://${var.domain}"
  }
}

// Create the policy
resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.site.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource = [
          aws_s3_bucket.site.arn,
          "${aws_s3_bucket.site.arn}/*",
        ]
      },
    ]
  })
}

// Add the files to the bucket
resource "aws_s3_bucket_object" "site" {
  for_each = module.src_dir.files

  bucket       = aws_s3_bucket.site.id
  key          = each.key
  content_type = each.value.content_type
  source       = each.value.source_path
  content      = each.value.content

  etag = each.value.digests.md5
}

/*
  Add the DNS records.
*/

// Add the CNAME for the root
resource "cloudflare_record" "site" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = var.domain
  value   = aws_s3_bucket.site.website_endpoint
  type    = "CNAME"
  proxied = true

  tags            = [""]
  comment         = ""
  allow_overwrite = false
}

// Add the CNAME for www that points to the root
resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = "www"
  value   = var.domain
  type    = "CNAME"
  proxied = true

  tags            = [""]
  comment         = ""
  allow_overwrite = false
}

/*
  Setup a page rule for the whole site.
*/
resource "cloudflare_page_rule" "main_rule" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  target  = "*.${var.domain}/*"

  actions {
    cache_level = "cache_everything"
    // A day
    browser_cache_ttl = 86400
    // A week
    edge_cache_ttl = 86400 * 7

    email_obfuscation           = ""
    explicit_cache_control      = ""
    disable_performance         = false
    mirage                      = ""
    true_client_ip_header       = ""
    automatic_https_rewrites    = ""
    browser_check               = ""
    disable_apps                = false
    disable_zaraz               = false
    cache_deception_armor       = ""
    disable_railgun             = false
    waf                         = ""
    cache_by_device_type        = ""
    cache_on_cookie             = ""
    always_use_https            = false
    ip_geolocation              = ""
    respect_strong_etag         = ""
    rocket_loader               = ""
    server_side_exclude         = ""
    ssl                         = ""
    disable_security            = false
    opportunistic_encryption    = ""
    polish                      = ""
    origin_error_page_pass_thru = ""
    resolve_override            = ""
    response_buffering          = ""
    security_level              = ""
    sort_query_string_for_cache = ""
    bypass_cache_on_cookie      = ""
    host_header_override        = ""
  }

  priority = 1
  status   = "active"
}
