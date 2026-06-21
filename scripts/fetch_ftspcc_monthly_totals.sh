#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/data"
BASE_URL="https://tradestat.commerce.gov.in/ftspcc/ttrade_country_wise"

month_name() {
  case "$1" in
    1) printf '%s' "January" ;;
    2) printf '%s' "February" ;;
    3) printf '%s' "March" ;;
    4) printf '%s' "April" ;;
    5) printf '%s' "May" ;;
    6) printf '%s' "June" ;;
    7) printf '%s' "July" ;;
    8) printf '%s' "August" ;;
    9) printf '%s' "September" ;;
    10) printf '%s' "October" ;;
    11) printf '%s' "November" ;;
    12) printf '%s' "December" ;;
    *) printf '%s' "" ;;
  esac
}

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

monthly_csv="$OUT_DIR/india_trade_monthly_totals.csv"
: > "$monthly_csv"
printf 'financial_year,calendar_year,month,month_name,export_usd_mn,import_usd_mn\n' >> "$monthly_csv"

extract_totals() {
  perl -0ne '
    sub clean {
      my $x = shift;
      $x =~ s/<[^>]*>//g;
      $x =~ s/&nbsp;/ /g;
      $x =~ s/,//g;
      $x =~ s/^\s+|\s+$//g;
      return $x;
    }
    if (/<tbody>(.*?)<\/tbody>/s) {
      my $body = $1;
      my ($exp, $imp) = (0, 0);
      while ($body =~ /<tr>(.*?)<\/tr>/sg) {
        my $row = $1;
        my @cells = ($row =~ /<t[dh][^>]*>(.*?)<\/t[dh]>/sg);
        next unless @cells >= 8;
        my $ex = clean($cells[6]);
        my $im = clean($cells[7]);
        $exp += $ex if length $ex;
        $imp += $im if length $im;
      }
      printf "%.2f\t%.2f\n", $exp, $imp;
    }
  ' "$1"
}

# Respect shared year-range env vars so a single TRADE_YEAR_START/END env controls all scripts.
YEAR_START="${TRADE_YEAR_START:-2010}"
YEAR_END="${TRADE_YEAR_END:-2025}"

for fiscal_start in $(seq "$YEAR_START" "$YEAR_END"); do
  for month in 4 5 6 7 8 9 10 11 12; do
    year="$fiscal_start"
    curl -L --silent -c "$tmpdir/cookies.txt" "$BASE_URL" -o "$tmpdir/page.html"
    token="$(sed -n 's/.*name="_token" value="\([^"]*\)".*/\1/p' "$tmpdir/page.html" | head -n 1)"
    if [[ -z "$token" ]]; then
      echo "Could not read FTSPCC CSRF token" >&2
      exit 1
    fi
    result_html="$tmpdir/result-${year}-${month}.html"
    curl -L --silent -b "$tmpdir/cookies.txt" -c "$tmpdir/cookies.txt" -X POST "$BASE_URL" \
      -d "_token=$token&MonthCwTt=$month&YearCwTt=$year&countryCwTt=all&ValuesCwTt=0" \
      -o "$result_html"
    totals="$(extract_totals "$result_html")"
    export_value="${totals%%$'\t'*}"
    import_value="${totals#*$'\t'}"
    fy="${fiscal_start}-$(printf '%04d' "$((fiscal_start + 1))")"
    printf '%s,%s,%s,%s,%s,%s\n' \
      "$fy" "$year" "$month" "$(month_name "$month")" "$export_value" "$import_value" >> "$monthly_csv"
    printf 'Fetched %s %s\n' "$fy" "$(month_name "$month")" >&2
  done
  for month in 1 2 3; do
    year="$((fiscal_start + 1))"
    curl -L --silent -c "$tmpdir/cookies.txt" "$BASE_URL" -o "$tmpdir/page.html"
    token="$(sed -n 's/.*name="_token" value="\([^"]*\)".*/\1/p' "$tmpdir/page.html" | head -n 1)"
    if [[ -z "$token" ]]; then
      echo "Could not read FTSPCC CSRF token" >&2
      exit 1
    fi
    result_html="$tmpdir/result-${year}-${month}.html"
    curl -L --silent -b "$tmpdir/cookies.txt" -c "$tmpdir/cookies.txt" -X POST "$BASE_URL" \
      -d "_token=$token&MonthCwTt=$month&YearCwTt=$year&countryCwTt=all&ValuesCwTt=0" \
      -o "$result_html"
    totals="$(extract_totals "$result_html")"
    export_value="${totals%%$'\t'*}"
    import_value="${totals#*$'\t'}"
    fy="${fiscal_start}-$(printf '%04d' "$((fiscal_start + 1))")"
    printf '%s,%s,%s,%s,%s,%s\n' \
      "$fy" "$year" "$month" "$(month_name "$month")" "$export_value" "$import_value" >> "$monthly_csv"
    printf 'Fetched %s %s\n' "$fy" "$(month_name "$month")" >&2
  done
done
