// Setup the S3 bucket.

// Create the bucket
resource "aws_s3_bucket_website_configuration" "site" {
  bucket = var.domain

  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

// Create the redirect for www
resource "aws_s3_bucket_website_configuration" "www" {
  bucket = "www.${var.domain}"

  redirect_all_requests_to = "https://${var.domain}"
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
  }
}
