import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, "VIRALBOOK AI  |  LIVROS QUE VALEM MILHÕES", border=0, new_x="LMARGIN", new_y="NEXT", align="R")
        self.set_draw_color(220, 220, 220)
        self.line(10, 18, 200, 18)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Página {self.page_no()}/{{nb}}  ·  viralbook-ai.vercel.app", align="C")

def create_ebook_pdf():
    md_path = r"C:\Users\HP\.gemini\antigravity\brain\29ad5b6a-38d7-4bcb-8333-69df03805fd0\LIVROS_QUE_VALEM_MILHOES.md"
    out_path = r"c:\Users\HP\Desktop\VIRALBOOK AI\viralbook-ai\public\Livros_Que_Valem_Milhoes_ViralBook_AI.pdf"

    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    pdf = PDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()
    pdf.set_left_margin(15)
    pdf.set_right_margin(15)

    # Title Banner / Cover Header
    pdf.ln(10)
    pdf.set_fill_color(37, 99, 235) # Primary Blue
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 22)
    pdf.multi_cell(0, 14, "LIVROS QUE VALEM MILHÕES", align="C", fill=True)
    pdf.ln(2)
    pdf.set_fill_color(30, 41, 59)
    pdf.set_font("Helvetica", "B", 12)
    pdf.multi_cell(0, 10, "Como Extrair Ideias de Software de Bestsellers e Construir um Micro SaaS Lucrativo", align="C", fill=True)
    
    pdf.ln(6)
    pdf.set_text_color(100, 100, 100)
    pdf.set_font("Helvetica", "I", 10)
    pdf.cell(0, 8, "Por ViralBook AI  ·  Edição Digital Exclusiva (2025)", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)

    def clean(text: str) -> str:
        replacements = {
            "—": "-", "–": "-", "“": '"', "”": '"', "’": "'", "‘": "'",
            "⭐": "*", "✅": "[x]", "❌": "[ ]", "🔄": "[~]", "💬": "",
            "📚": "", "💡": "", "🎨": "", "🤝": "", "🚀": "", "🔗": "",
            "📡": "", "📖": "", "⚡": "", "👀": "", "🎁": "", "©": "(c)"
        }
        for k, v in replacements.items():
            text = text.replace(k, v)
        return text.encode("latin-1", "ignore").decode("latin-1")

    for line in lines:
        line_str = clean(line.strip())
        if not line_str:
            pdf.ln(3)
            continue
        
        if line_str.startswith("# "):
            title = line_str.replace("# ", "")
            pdf.ln(6)
            pdf.set_font("Helvetica", "B", 16)
            pdf.set_text_color(37, 99, 235)
            pdf.multi_cell(0, 8, title)
            pdf.set_draw_color(37, 99, 235)
            pdf.line(15, pdf.get_y(), 195, pdf.get_y())
            pdf.ln(4)
        elif line_str.startswith("## "):
            subtitle = line_str.replace("## ", "")
            pdf.ln(4)
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_text_color(30, 41, 59)
            pdf.multi_cell(0, 7, subtitle)
            pdf.ln(2)
        elif line_str.startswith("### "):
            sub3 = line_str.replace("### ", "")
            pdf.ln(3)
            pdf.set_font("Helvetica", "B", 11)
            pdf.set_text_color(51, 65, 85)
            pdf.multi_cell(0, 6, sub3)
            pdf.ln(1)
        elif line_str.startswith(">"):
            quote = line_str.replace(">", "").strip()
            pdf.set_font("Helvetica", "I", 10)
            pdf.set_text_color(70, 70, 70)
            pdf.set_fill_color(241, 245, 249)
            pdf.multi_cell(0, 6, f"   \"{quote}\"", fill=True)
            pdf.ln(2)
        elif line_str.startswith("- ") or line_str.startswith("• "):
            bullet = line_str[2:]
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(30, 30, 30)
            pdf.multi_cell(0, 5, f"  *  {bullet}")
            pdf.ln(1)
        elif line_str.startswith("---"):
            pdf.ln(4)
            pdf.set_draw_color(226, 232, 240)
            pdf.line(15, pdf.get_y(), 195, pdf.get_y())
            pdf.ln(4)
        else:
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(30, 30, 30)
            pdf.multi_cell(0, 5.5, line_str)
            pdf.ln(1.5)

    pdf.output(out_path)
    print(f"PDF gerado com sucesso em: {out_path}")

if __name__ == "__main__":
    create_ebook_pdf()
