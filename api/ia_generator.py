from typing import Dict, List, Optional, Set
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BrdAnswers(BaseModel):
    businessGoals: str
    targetAudience: str
    keyFeatures: str
    contentTypes: str
    designPreferences: str
    technicalRequirements: str
    timeline: str
    budget: str

class FollowUpAnswer(BaseModel):
    question: str
    answer: str

class IaRequest(BaseModel):
    brdAnswers: BrdAnswers
    followUpAnswers: List[FollowUpAnswer]

def get_section_structure(business_type, selected_pages):
    # Define section hierarchy based on business type
    section_hierarchy = {
        'corporate': {
            'Home Page': ['Hero', 'Features', 'Call to Action'],
            'About Us': ['Our History', 'Team', 'Mission'],
            'Services': ['Service List', 'Benefits', 'Pricing'],
            'Products': ['Product List', 'Features', 'Specifications'],
            'Case Studies': ['Projects', 'Results', 'Testimonials'],
            'Articles/Blog': ['Recent Posts', 'Categories', 'Featured'],
            'Careers': ['Open Positions', 'Benefits', 'Culture'],
            'Contact Us': ['Form', 'Map', 'Info']
        },
        'ecommerce': {
            'Home Page': ['Hero', 'Featured Products', 'Categories'],
            'Products': ['Product List', 'Categories', 'Filters'],
            'Pricing': ['Plans', 'Discounts', 'Shipping'],
            'Shop': ['Store Pages', 'Products', 'Categories'],
            'Customer Service': ['FAQ', 'Contact', 'Returns'],
            'Contact Us': ['Form', 'Support Hours', 'Info']
        },
        'portfolio': {
            'Home Page': ['Hero', 'Featured Work', 'Testimonials'],
            'About Us': ['Bio', 'Skills', 'Experience'],
            'Case Studies': ['Projects', 'Process', 'Results'],
            'Services': ['Service List', 'Process', 'Pricing'],
            'Contact Us': ['Form', 'Availability', 'Info']
        },
        'saas': {
            'Home Page': ['Hero', 'Features', 'Testimonials'],
            'Features': ['Feature List', 'Benefits', 'Screenshots'],
            'Pricing': ['Plans', 'Features', 'FAQ'],
            'Articles/Blog': ['Recent Posts', 'Categories', 'Resources'],
            'Contact Us': ['Form', 'Support', 'Info']
        },
        'museum': {
            'Home Page': ['Hero', 'Current Exhibitions', 'Events'],
            'Visit': ['Getting here', 'Opening hours', 'Contact Info'],
            "What's On": ['Exhibits', 'Music Events', 'Workshops'],
            'Shop': ['Store Pages', 'Products', 'Categories'],
            'Learning': ['Teacher Resources', 'Activity Sheets', 'Tours'],
            'Contact Us': ['Form', 'Map', 'Info']
        }
    }
    
    # Get hierarchy for selected business type
    hierarchy = section_hierarchy.get(business_type, {})
    
    # Filter sections based on selected pages
    selected_hierarchy = {
        section: subsections 
        for section, subsections in hierarchy.items()
        if section in selected_pages
    }
    
    return selected_hierarchy

def extract_business_info(key_features: str) -> tuple[str, List[str]]:
    """Extract business type and selected pages from key features string"""
    try:
        # Parse "Business Type: type, Selected Pages: page1, page2, ..."
        parts = key_features.split(', Selected Pages: ')
        business_type = parts[0].replace('Business Type: ', '').strip()
        selected_pages = [page.strip() for page in parts[1].split(', ')]
        return business_type, selected_pages
    except:
        return '', []

def generate_ia_structure(brd_answers: BrdAnswers) -> str:
    # Extract business type and selected pages from keyFeatures
    business_type, selected_pages = extract_business_info(brd_answers.keyFeatures)
    
    # Get section hierarchy
    hierarchy = get_section_structure(business_type, selected_pages)
    
    # Generate markdown structure
    markdown = "# Information Architecture\n\n"
    markdown += "## Structure\n"
    
    # Add homepage
    markdown += "- Homepage\n"
    
    # Add main sections and subsections in sequence
    for section, subsections in hierarchy.items():
        markdown += f"  - {section}\n"
        # Add subsections with proper indentation to show hierarchy
        for i, subsection in enumerate(subsections):
            markdown += f"    - {subsection}\n"
    
    # Add connections section
    markdown += "\n## Connections\n"
    
    # Connect homepage to first section only
    first_section = next(iter(hierarchy.keys()), None)
    if first_section:
        markdown += f"Homepage -> {first_section}\n"
    
    # Create sequential connections between sections
    sections = list(hierarchy.keys())
    for i in range(len(sections) - 1):
        markdown += f"{sections[i]} -> {sections[i + 1]}\n"
    
    # Create sequential connections between subsections within each section
    for section, subsections in hierarchy.items():
        # Connect section to its first subsection
        if subsections:
            markdown += f"{section} -> {subsections[0]}\n"
            
        # Connect subsections sequentially
        for i in range(len(subsections) - 1):
            markdown += f"{subsections[i]} -> {subsections[i + 1]}\n"
    
    print(f"Generated markdown:\n{markdown}")  # Debug logging
    return markdown

@app.post("/generate-ia")
async def generate_ia(request: IaRequest):
    try:
        print(f"Received request: {request}")  # Debug logging
        ia_structure = generate_ia_structure(request.brdAnswers)
        return {"iaStructure": ia_structure}
    except Exception as e:
        print(f"Error generating IA: {str(e)}")  # Add logging
        import traceback
        print(traceback.format_exc())  # Print full traceback
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 