locals {
  ses_domain       = var.domain
  mail_from_domain = "mail.${local.ses_domain}"
  dmarc_email      = "admin@jai.vin"
}

/*
  Create and verify an AWS SES domain identity.
*/

// Create the SES domain identity
resource "aws_ses_domain_identity" "ses_domain" {
  domain = local.ses_domain
}

// Verify the domain identity with a DNS record
resource "cloudflare_record" "ses_domain_dns" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = "_amazonses"
  type    = "TXT"
  value   = aws_ses_domain_identity.ses_domain.verification_token
}

// Tie it back in with a DNS verification on AWS
resource "aws_ses_domain_identity_verification" "ses_domain_verification" {
  // Connects to the SES domain ID
  domain = aws_ses_domain_identity.ses_domain.id

  // Waits for the DNS record on Cloudflare to be created
  depends_on = [cloudflare_record.ses_domain_dns]
}

/*
  Create DKIM tokens and add them to DNS records.
*/

// Create the DKIM tokens
resource "aws_ses_domain_dkim" "ses_dkim" {
  domain = local.ses_domain
}

// Add DNS records for the DKIM tokens
resource "cloudflare_record" "ses_dkim_dns" {
  // Add all 3 of the DKIM tokens
  count   = 3
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = "${element(aws_ses_domain_dkim.ses_dkim.dkim_tokens, count.index)}._domainkey"
  type    = "CNAME"
  value   = "${element(aws_ses_domain_dkim.ses_dkim.dkim_tokens, count.index)}.dkim.amazonses.com"
}

/*
  Create the SES mail from domain.
*/

// Create the mail from resource for mail.domain
resource "aws_ses_domain_mail_from" "ses_mail_from" {
  domain           = aws_ses_domain_identity.ses_domain.domain
  mail_from_domain = local.mail_from_domain
}

// Add the mail from MX DNS record
resource "cloudflare_record" "ses_mail_from_dns_mx" {
  zone_id  = data.cloudflare_zones.domain.zones[0].id
  name     = local.mail_from_domain
  type     = "MX"
  priority = 10

  // Using the us-west-1 region to improve inbox placement
  value = "feedback-smtp.us-west-1.amazonses.com"
}

/*
  Add an MX DNS record for email forwarding/receiving
*/
resource "cloudflare_record" "isaac_forward_mx" {
  zone_id  = data.cloudflare_zones.domain.zones[0].id
  name     = local.ses_domain
  type     = "MX"
  priority = 37
  value    = "isaac.mx.cloudflare.net"
}
resource "cloudflare_record" "linda_forward_mx" {
  zone_id  = data.cloudflare_zones.domain.zones[0].id
  name     = local.ses_domain
  type     = "MX"
  priority = 23
  value    = "linda.mx.cloudflare.net"
}
resource "cloudflare_record" "amir_forward_mx" {
  zone_id  = data.cloudflare_zones.domain.zones[0].id
  name     = local.ses_domain
  type     = "MX"
  priority = 2
  value    = "amir.mx.cloudflare.net"
}

/*
  Add DMARC and SPF DNS records.
*/

// Add the mail from TXT DNS record for SPF
resource "cloudflare_record" "ses_mail_from_dns_spf" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = local.mail_from_domain
  type    = "TXT"
  value   = "v=spf1 include:_spf.mx.cloudflare.net ~all"
}

// Add the DMARC DNS record
resource "cloudflare_record" "ses_dns_dmarc" {
  zone_id = data.cloudflare_zones.domain.zones[0].id
  name    = "_dmarc.${local.mail_from_domain}"
  type    = "TXT"
  value   = "v=DMARC1; p=none; rua=mailto:${local.dmarc_email}"
}
