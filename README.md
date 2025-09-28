# JFrame - AI Adaptive Cards Generator

An AI-powered wrapper for Adaptive Cards that uses GPT to generate beautiful, interactive cards from natural language prompts.

> **Our Philosophy**: Under-promise and over-deliver. Always. See [JOTTR-CHARTER.md](./JOTTR-CHARTER.md) for our core principles.

## Features

- 🤖 **AI-Powered Generation**: Uses OpenAI's GPT models to create Adaptive Cards from simple text prompts
- 🎨 **Visual Interface**: Clean, modern chat-like interface suitable for GitHub Pages
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔒 **Privacy-Focused**: API keys are stored locally and never sent to our servers
- 🎯 **Easy to Use**: Just enter a prompt and get a fully-rendered Adaptive Card

## Usage

1. **Open the Application**: Visit the deployed GitHub Pages site or open `index.html` locally
2. **Enter API Key**: Add your OpenAI API key (stored locally in your browser)
3. **Enter Prompt**: Type a description of the card you want to create
4. **Generate**: Click "Generate" or press Enter to create your Adaptive Card

### Example Prompts

- "create a simple card with a picture and a short description of the Eiffel Tower in Paris"
- "make a weather card showing sunny weather with temperature 75°F"
- "create a product card for a laptop with specs and price"
- "design a profile card for John Doe with contact information"

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Adaptive Cards**: Uses the [neurodance/adaptivecards](https://github.com/neurodance/adaptivecards) library (Microsoft fork)
- **AI Integration**: OpenAI GPT API for card generation
- **Deployment**: GitHub Pages ready

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/neurodance/jframe.git
   cd jframe
   ```

2. Open `index.html` in your browser or serve it with a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Enter your API key in the application and start generating cards!

### GitHub Pages Deployment

This project is designed to work seamlessly with GitHub Pages:

1. Fork or clone this repository
2. Enable GitHub Pages in your repository settings
3. Your app will be available at `https://yourusername.github.io/jframe`

## API Key Security

- API keys are stored only in your browser's localStorage
- Keys are never transmitted to any server except OpenAI's API
- You can clear your API key at any time by clearing browser storage

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Microsoft Adaptive Cards](https://adaptivecards.io/) for the amazing framework
- [neurodance/adaptivecards](https://github.com/neurodance/adaptivecards) for the forked implementation
- OpenAI for providing the GPT API that powers the card generation
# Deployed to jframe.ai via Cloudflare Pages
