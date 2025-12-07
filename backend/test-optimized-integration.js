import aiService from './services/aiService.js';
import fs from 'fs';
import path from 'path';

async function testOptimizedIntegration() {
  console.log('🧪 Testing Optimized FastAPI Integration\n');
  
  // Test user context
  const userContext = {
    name: 'Test User',
    height_cm: 170,
    weight_kg: 65,
    age: 25,
    gender: 'male'
  };

  try {
    // Test 1: Direct FastAPI endpoint test
    console.log('Test 1: Testing FastAPI endpoint directly...');
    const fastApiTest = await aiService.testFastAPIEndpoint();
    console.log('FastAPI Test Result:', fastApiTest);
    console.log('---\n');

    // Test 2: Test with minimal image
    console.log('Test 2: Testing with minimal test image...');
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(testImageBase64, 'base64');
    
    const analysisResult = await aiService.analyzeFoodFromImage(imageBuffer, userContext);
    console.log('Analysis Result:', JSON.stringify(analysisResult, null, 2));
    console.log('---\n');

    // Test 3: Test with a larger synthetic image
    console.log('Test 3: Testing with synthetic food image...');
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(224, 224);
    const ctx = canvas.getContext('2d');
    
    // Create a simple food-like pattern
    ctx.fillStyle = '#8B4513'; // Brown color for food
    ctx.fillRect(0, 0, 224, 224);
    ctx.fillStyle = '#FFD700'; // Golden color
    ctx.fillRect(50, 50, 124, 124);
    
    const syntheticImageBuffer = canvas.toBuffer('image/png');
    const syntheticResult = await aiService.analyzeFoodFromImage(syntheticImageBuffer, userContext);
    console.log('Synthetic Image Result:', JSON.stringify(syntheticResult, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testOptimizedIntegration();
