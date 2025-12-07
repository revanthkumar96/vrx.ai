const AIService = require('./services/aiService.js');
const fs = require('fs');
const path = require('path');

async function testFastAPIIntegration() {
  console.log('🧪 Testing FastAPI Food Classifier Integration\n');
  
  const aiService = new AIService();
  
  try {
    // Test 1: Test the endpoint connectivity
    console.log('Test 1: Testing endpoint connectivity...');
    const connectivityTest = await aiService.testFastAPIEndpoint();
    console.log('Result:', connectivityTest);
    console.log('---\n');
    
    // Test 2: Test with a real image if available
    const testImagePath = path.join(__dirname, 'test_image.jpg');
    if (fs.existsSync(testImagePath)) {
      console.log('Test 2: Testing with real image...');
      const imageBuffer = fs.readFileSync(testImagePath);
      const userContext = {
        name: 'Test User',
        height_cm: 170,
        weight_kg: 65,
        age: 25,
        gender: 'male'
      };
      
      const analysisResult = await aiService.analyzeFoodFromImage(imageBuffer, userContext);
      console.log('Analysis Result:', JSON.stringify(analysisResult, null, 2));
    } else {
      console.log('Test 2: No test image found at', testImagePath);
      console.log('To test with a real image, place a food image at:', testImagePath);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testFastAPIIntegration();
