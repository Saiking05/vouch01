"""
PDF generation for reports — converts report JSON to downloadable PDFs.
"""
import io
import html
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak


def _clean(text: str) -> str:
    if not text:
        return ""
    s = str(text).replace("**", "").replace("*", "").replace("###", "").replace("##", "").replace("#", "")
    return html.escape(s.strip())


def report_to_pdf(report: dict) -> bytes:
    """Generate a single PDF from report data."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter,
        rightMargin=0.75 * inch, leftMargin=0.75 * inch,
        topMargin=0.75 * inch, bottomMargin=0.75 * inch,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        name="ReportTitle", parent=styles["Heading1"],
        fontSize=18, spaceAfter=12, textColor=colors.HexColor("#1a1a1a"),
    )
    heading_style = ParagraphStyle(
        name="SectionHeading", parent=styles["Heading2"],
        fontSize=14, spaceBefore=16, spaceAfter=8, textColor=colors.HexColor("#333333"),
    )
    body_style = ParagraphStyle(
        name="Body", parent=styles["Normal"],
        fontSize=10, spaceAfter=8, textColor=colors.HexColor("#444444"),
    )

    story = []
    data = report.get("report_data") or {}
    name = report.get("name", "Report")

    story.append(Paragraph(_clean(name), title_style))
    story.append(Spacer(1, 0.2 * inch))

    summary = data.get("summary", "")
    if summary:
        story.append(Paragraph("<b>Executive Summary</b>", heading_style))
        story.append(Paragraph(_clean(summary), body_style))
        story.append(Spacer(1, 0.15 * inch))

    key_insights = data.get("key_insights", [])
    if key_insights:
        story.append(Paragraph("<b>Key Insights</b>", heading_style))
        for insight in key_insights[:10]:
            story.append(Paragraph(f"• {_clean(str(insight))}", body_style))
        story.append(Spacer(1, 0.15 * inch))

    score = data.get("score")
    rec = data.get("recommendation", "")
    if score is not None or rec:
        story.append(Paragraph("<b>Assessment</b>", heading_style))
        if score is not None:
            story.append(Paragraph(f"Overall Score: {score}/100", body_style))
        if rec:
            story.append(Paragraph(f"Recommendation: {rec}", body_style))
        story.append(Spacer(1, 0.15 * inch))

    for section in data.get("sections", []):
        if section.get("heading"):
            story.append(Paragraph(_clean(section["heading"]), heading_style))
        if section.get("content"):
            story.append(Paragraph(_clean(section["content"]), body_style))
        story.append(Spacer(1, 0.1 * inch))

    brief = data.get("brief", "")
    if brief:
        story.append(Paragraph("<b>Marketing Brief</b>", heading_style))
        story.append(Paragraph(_clean(brief), body_style))

    doc.build(story)
    return buffer.getvalue()


def reports_to_combined_pdf(reports: list[dict]) -> bytes:
    """Combine multiple reports into one PDF."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter,
        rightMargin=0.75 * inch, leftMargin=0.75 * inch,
        topMargin=0.75 * inch, bottomMargin=0.75 * inch,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        name="ReportTitle", parent=styles["Heading1"],
        fontSize=18, spaceAfter=12, textColor=colors.HexColor("#1a1a1a"),
    )
    heading_style = ParagraphStyle(
        name="SectionHeading", parent=styles["Heading2"],
        fontSize=14, spaceBefore=16, spaceAfter=8, textColor=colors.HexColor("#333333"),
    )
    body_style = ParagraphStyle(
        name="Body", parent=styles["Normal"],
        fontSize=10, spaceAfter=8, textColor=colors.HexColor("#444444"),
    )
    story = []

    for i, report in enumerate(reports):
        if i > 0:
            story.append(PageBreak())
        data = report.get("report_data") or {}
        name = report.get("name", "Report")
        story.append(Paragraph(_clean(name), title_style))
        story.append(Spacer(1, 0.2 * inch))
        summary = data.get("summary", "")
        if summary:
            story.append(Paragraph("<b>Executive Summary</b>", heading_style))
            story.append(Paragraph(_clean(summary), body_style))
            story.append(Spacer(1, 0.15 * inch))
        key_insights = data.get("key_insights", [])
        if key_insights:
            story.append(Paragraph("<b>Key Insights</b>", heading_style))
            for insight in key_insights[:10]:
                story.append(Paragraph(f"• {_clean(str(insight))}", body_style))
            story.append(Spacer(1, 0.15 * inch))
        score, rec = data.get("score"), data.get("recommendation", "")
        if score is not None or rec:
            story.append(Paragraph("<b>Assessment</b>", heading_style))
            if score is not None:
                story.append(Paragraph(f"Overall Score: {score}/100", body_style))
            if rec:
                story.append(Paragraph(f"Recommendation: {rec}", body_style))
            story.append(Spacer(1, 0.15 * inch))
        for section in data.get("sections", []):
            if section.get("heading"):
                story.append(Paragraph(_clean(section["heading"]), heading_style))
            if section.get("content"):
                story.append(Paragraph(_clean(section["content"]), body_style))
            story.append(Spacer(1, 0.1 * inch))
        brief = data.get("brief", "")
        if brief:
            story.append(Paragraph("<b>Marketing Brief</b>", heading_style))
            story.append(Paragraph(_clean(brief), body_style))

    doc.build(story)
    return buffer.getvalue()
