variable "domain" {
  description = "The domain of this project."
  type        = string
  default     = "jai.vin"
}

variable "aws_region" {
  description = "The default region of our AWS resources."
  type        = string
  default     = "us-east-1"
}
