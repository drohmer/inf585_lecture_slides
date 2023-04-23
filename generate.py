import os
import yaml
import argparse


plugins_html = ['static_website_lhtml/plugins/auto-wrap.py', 'static_website_lhtml/plugins/menu.py', 'static_website_lhtml/plugins/redirection_first_page.py']
plugins_pdf = ['static_website_lhtml/plugins/auto-wrap.py', 'static_website_lhtml/plugins/menu.py', 'static_website_lhtml/plugins/generate_pdf.py']
cache_video_directory = 'cache_video/'

source_root_directory = 'src/'
site_directory = '_site/'

compile_all = False
compile_dirs = ['03_procedural_noise/']



if __name__== '__main__':

    parser = argparse.ArgumentParser(description='Generate Course Website')
    parser.add_argument('-p','--pdf', action='store_true',help='Add PDF generation.')
    parser.add_argument('-a','--all', action='store_true',help='Force to generate all the source.')
    parser.add_argument('-v','--videos', action='store_true',help='Add video cache generation.')
    parser.add_argument('-d','--debug', action='store_true',help='Debug info.')
    args = parser.parse_args()

    # move to directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if args.all==True:
        compile_all = True

    if compile_all:
        all_dirs = sorted(os.listdir(source_root_directory))
        compile_dirs = []
        for d in all_dirs:
            compile_dirs.append(d+'/')
    
    if args.videos:
        plugins_html.append('static_website_lhtml/plugins/cache_video.py')
        plugins_pdf.append('static_website_lhtml/plugins/cache_video.py')


    for entry_dir in compile_dirs:
        source_directory = source_root_directory+entry_dir

        config_html = {'source_directory':source_directory, 'site_directory':site_directory+entry_dir+'html/', 'theme':'static_website_lhtml/theme_templates/slides/', 'cache_video_directory': 'cache_video/'+entry_dir, 'plugin':plugins_html, 'debug':args.debug}
        
        config_pdf = {'source_directory':source_directory, 'site_directory':site_directory+entry_dir+'pdf/', 'theme':'static_website_lhtml/theme_templates/slides-pdf/', 'cache_video_directory': 'cache_video/'+entry_dir, 'plugin':plugins_pdf, 'debug':args.debug}



        # HTML
        config_yaml = yaml.dump(config_html)
        with open('configure_temp.yaml','w') as fid:
            fid.write(config_yaml)
        os.system(f'python3 static_website_lhtml/generate.py -i configure_temp.yaml')

        # PDF
        if args.pdf==True:
            config_yaml = yaml.dump(config_pdf)
            with open('configure_temp.yaml','w') as fid:
                fid.write(config_yaml)
            os.system(f'python3 static_website_lhtml/generate.py -i configure_temp.yaml')
            #rename pdf output using the current directory
            pdf_file_in = site_directory+entry_dir+'slides.pdf'
            pdf_file_out = site_directory+entry_dir+entry_dir[:-1]+'.pdf'
            os.system(f'mv {pdf_file_in} {pdf_file_out}')

        # Clean configure_temp
        os.system('rm configure_temp.yaml')