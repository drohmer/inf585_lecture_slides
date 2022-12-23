import os
import yaml
import argparse

#'plugins/cache_video.py'
plugins_html = ['plugins/auto-wrap.py', 'plugins/menu.py', 'plugins/redirection_first_page.py']
plugins_pdf = ['plugins/auto-wrap.py', 'plugins/menu.py', 'plugins/generate_pdf.py']
cache_video_directory = '../cache_video/'

source_root_directory = 'src/'
site_directory = '_site/'

compile_all = True
compile_dirs = ['02_procedural_trajectory/']



if __name__== '__main__':

    parser = argparse.ArgumentParser(description='Generate Course Website')
    parser.add_argument('-p','--pdf', action='store_true',help='Add PDF generation.')
    parser.add_argument('-a','--all', action='store_true',help='Force to generate all the source.')
    parser.add_argument('-v','--videos', action='store_true',help='Add video cache generation.')
    args = parser.parse_args()

    if args.all != None:
        compile_all = True

    if compile_all:
        all_dirs = sorted(os.listdir(source_root_directory))
        compile_dirs = []
        for d in all_dirs:
            compile_dirs.append(d+'/')
    
    if args.videos:
        plugins_html.append('plugins/cache_video.py')
        plugins_pdf.append('plugins/cache_video.py')


    for entry_dir in compile_dirs:
        source_directory = source_root_directory+entry_dir

        config_html = {'source_directory':'../'+source_directory, 'site_directory':'../'+site_directory+entry_dir+'html/', 'theme':'theme_templates/slides/', 'cache_video_directory': '../cache_video/'+entry_dir, 'plugin':plugins_html}
        
        config_pdf = {'source_directory':'../'+source_directory, 'site_directory':'../'+site_directory+entry_dir+'pdf/', 'theme':'theme_templates/slides-pdf/', 'cache_video_directory': '../cache_video/'+entry_dir, 'plugin':plugins_pdf}

        # HTML
        config_yaml = yaml.dump(config_html)
        with open('configure_temp.yaml','w') as fid:
            fid.write(config_yaml)
        os.system('cd static_website_lhtml; python generate.py -i ../configure_temp.yaml')

        # PDF
        if args.pdf==True:
            config_yaml = yaml.dump(config_pdf)
            with open('configure_temp.yaml','w') as fid:
                fid.write(config_yaml)
            os.system('cd static_website_lhtml; python generate.py -i ../configure_temp.yaml')

        # Clean configure_temp
        os.system('rm configure_temp.yaml')